from collections import defaultdict

from django.contrib.auth.models import Permission, Group
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import F, Sum
from rest_framework import status
from rest_framework.response import Response

from schools.models import TrainingPoint, Faculty, Class, Semester
from users.models import Administrator, Account, Specialist, Assistant, Student

SPECIALIST_PERMISSIONS = [
    "create_assistant_account",
    "view_faculty_statistics",
    "export_faculty_statistics",
]

ASSISTANT_PERMISSIONS = [
    "view_class_statistics",
    "export_class_statistics",
    "upload_attendance_csv",
    "view_reported_list",
    "view_deficiency_list",
    "resolve_deficiency",
    "add_activity",
]

STUDENT_PERMISSIONS = [
    "register_activity",
    "report_activity",
    "view_participated_list",
    "view_registered_list",
    "view_trainingpoint",
]

ACHIEVEMENTS = ["Xuất sắc", "Giỏi", "Khá", "Trung bình", "Yếu", "Kém"]


class Factory:
    def create_user_account(self, data, code, user_model):
        try:
            user = user_model.objects.get(code=code)
        except ObjectDoesNotExist:
            return Response(data={"message": "Không tìm thấy người dùng"}, status=status.HTTP_404_NOT_FOUND)

        if user.account is not None:
            return Response(data={"message": "Người dùng đã có tài khoản"}, status=status.HTTP_400_BAD_REQUEST)

        account = Account.objects.create(**data)
        account.set_password(account.password)
        account.save()

        user.account = account
        user.save()

        self.set_role(user)
        self.set_permissions_for_account(account)

        return account

    def set_permissions_for_account(self, account):
        group_name, _ = self.check_account_role(account)
        if group_name.__eq__("administrator"):
            groups = [
                Group.objects.get_or_create(name="specialist")[0],
                Group.objects.get_or_create(name="assistant")[0],
                Group.objects.get_or_create(name="student")[0],
            ]
            account.groups.set(groups)
        else:
            group, created = Group.objects.get_or_create(name=group_name)
            groups = [group, ]

            if created:
                if group_name.__eq__("student"):
                    permissions = Permission.objects.filter(codename__in=STUDENT_PERMISSIONS)
                    group.permissions.set(permissions)
                elif group_name.__eq__("assistant"):
                    permissions = Permission.objects.filter(codename__in=ASSISTANT_PERMISSIONS)
                    group.permissions.set(permissions)
                elif group_name.__eq__("specialist"):
                    permissions = Permission.objects.filter(codename__in=SPECIALIST_PERMISSIONS)
                    group.permissions.set(permissions)
                    assistant_group, _ = Group.objects.get_or_create(name="assistant")
                    groups.append(assistant_group)

            account.groups.set(groups)

        return account

    def check_user_instance(self, instance):
        from users import serializers as users_serializers
        instance_mapping = {
            Administrator: ("administrator", users_serializers.AdministratorSerializer, Account.Role.ADMINISTRATOR),
            Specialist: ("specialist", users_serializers.SpecialistSerializer, Account.Role.SPECIALIST),
            Assistant: ("assistant", users_serializers.AssistantSerializer, Account.Role.ASSISTANT),
            Student: ("student", users_serializers.StudentSerializer, Account.Role.STUDENT),
        }

        return instance_mapping.get(type(instance))

    def check_account_role(self, instance):
        from users import serializers
        role_mapping = {
            Account.Role.ADMINISTRATOR: ("administrator", serializers.AdministratorSerializer),
            Account.Role.SPECIALIST: ("specialist", serializers.SpecialistSerializer),
            Account.Role.ASSISTANT: ("assistant", serializers.AssistantSerializer),
            Account.Role.STUDENT: ("student", serializers.StudentSerializer),
        }

        return role_mapping.get(instance.role)

    def set_role(self, user):
        _, _, role = self.check_user_instance(user)

        user.account.role = role
        user.account.save()

        return user


class DAO:
    def update_training_point(self, registration):
        training_point, _ = TrainingPoint.objects.get_or_create(
            student=registration.student,
            semester=registration.activity.semester,
            criterion=registration.activity.criterion,
        )
        training_point.point = F("point") + registration.activity.point
        training_point.save()

        registration.is_point_added = True
        registration.is_attendance = True
        registration.save()

        return training_point

    def get_achievement(self, total_points):
        if total_points >= 90:
            achievement = "Xuất sắc"
        elif total_points >= 80:
            achievement = "Giỏi"
        elif total_points >= 65:
            achievement = "Khá"
        elif total_points >= 50:
            achievement = "Trung bình"
        elif total_points >= 35:
            achievement = "Yếu"
        else:
            achievement = "Kém"

        return achievement

    def get_student_summary(self, semester=None, student=None):
        points = student.points.filter(semester=semester) if semester else student.points.all()
        # student_total_points = points.aggregate(total_points=Sum("point", default=0))["total_points"]
        student_total_points = points.values("criterion_id").annotate(total_points=Sum("point"))
        print(student_total_points)

        return points, student_total_points

    def get_faculty_summary(self, semester=None, faculty=None):
        students = Student.objects.filter(faculty=faculty)

        faculty_total_students = students.count()
        faculty_total_points = 0

        achievements = {achievement: 0 for achievement in ACHIEVEMENTS}
        for student in students:
            _, student_total_points = self.get_student_summary(semester=semester, student=student)
            faculty_total_points += student_total_points
            achievement = dao.get_achievement(student_total_points)
            achievements[achievement] += 1

        faculty_average_points = faculty_total_points / faculty_total_students if faculty_total_students > 0 else 0

        return faculty_total_students, faculty_total_points, faculty_average_points, achievements

    def get_class_summary(self, semester=None, sclass=None):
        students = Student.objects.filter(sclass=sclass)

        class_total_students = students.count()
        class_total_points = 0

        achievements = {achievement: 0 for achievement in ACHIEVEMENTS}
        students_list = defaultdict(dict)
        for student in students:
            points, student_total_points = self.get_student_summary(semester=semester, student=student)
            class_total_points += student_total_points
            achievement = self.get_achievement(student_total_points)
            achievements[achievement] += 1

            students_list[student.code] = {
                "name": student.full_name,
                "achievement": achievement,
                **{point.criterion.name: point.point for point in points}
            }

        class_average_points = class_total_points / class_total_students if class_total_students > 0 else 0

        return class_total_students, class_total_points, class_average_points, achievements, students_list

    def statistics_points_by_faculty(self, semester_code, faculty_name):
        semester = Semester.objects.get(code=semester_code) if semester_code else None
        statistics_data = defaultdict(dict)

        faculties = Faculty.objects.filter(name__icontains=faculty_name) if faculty_name else Faculty.objects.all()
        for faculty in faculties:
            (faculty_total_students, faculty_total_points,
             faculty_average_points, achievements) = self.get_faculty_summary(semester=semester, faculty=faculty)

            data = {
                "total_students": faculty_total_students,
                "total_points": faculty_total_points,
                "average_points": faculty_average_points,
                "achievements": achievements,
            }
            statistics_data[faculty.name] = data

        return statistics_data

    def statistics_points_by_class(self, semester_code, class_name):
        semester = Semester.objects.get(code=semester_code) if semester_code else None
        statistics_data = defaultdict(dict)

        classes = Class.objects.filter(name__icontains=class_name) if class_name else Class.objects.all()
        for sclass in classes:
            (class_total_students, class_total_points,
             class_average_points, achievements, students_list) = self.get_class_summary(semester=semester, sclass=sclass)
            data = {
                "total_students": class_total_students,
                "total_points": class_total_points,
                "average_points": class_average_points,
                "achievements": achievements,
                "students_list": students_list,
            }
            statistics_data[sclass.name] = data

        return statistics_data


factory = Factory()
dao = DAO()
