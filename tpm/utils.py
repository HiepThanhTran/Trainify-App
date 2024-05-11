from django.contrib.auth.models import Permission, Group
from django.db import transaction
from django.db.models import F, Sum, Count
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from schools.models import TrainingPoint, Faculty, Class, Semester
from users.models import Administrator, Account, Specialist, Assistant, Student

SPECIALIST_PERMISSIONS = [
    'create_assistant_account',
    'view_faculty_statistics',
    'export_faculty_statistics',
]

ASSISTANT_PERMISSIONS = [
    'view_class_statistics',
    'export_class_statistics',
    'upload_attendance_csv',
    'view_reported_list',
    'view_deficiency_list',
    'resolve_deficiency',
    'add_activity',
    'add_bulletin'
]

STUDENT_PERMISSIONS = [
    'register_activity',
    'report_activity',
    'view_participated_list',
    'view_registered_list',
    'view_trainingpoint',
]

ACHIEVEMENTS = ['Xuất sắc', 'Giỏi', 'Khá', 'Trung bình', 'Yếu', 'Kém']


class Factory:
    def create_user_account(self, data, code, user_model):
        user = get_object_or_404(user_model, code=code)

        if user.account is not None:
            return Response(data={'message': 'Người dùng đã có tài khoản'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
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
        if group_name.__eq__('administrator'):
            groups = [
                Group.objects.get_or_create(name='specialist')[0],
                Group.objects.get_or_create(name='assistant')[0],
                Group.objects.get_or_create(name='student')[0],
            ]
            account.groups.set(groups)
        else:
            group, created = Group.objects.get_or_create(name=group_name)
            groups = [group, ]

            if created:
                if group_name.__eq__('student'):
                    permissions = Permission.objects.filter(codename__in=STUDENT_PERMISSIONS)
                    group.permissions.set(permissions)
                elif group_name.__eq__('assistant'):
                    permissions = Permission.objects.filter(codename__in=ASSISTANT_PERMISSIONS)
                    group.permissions.set(permissions)
                elif group_name.__eq__('specialist'):
                    permissions = Permission.objects.filter(codename__in=SPECIALIST_PERMISSIONS)
                    group.permissions.set(permissions)
                    assistant_group, _ = Group.objects.get_or_create(name='assistant')
                    groups.append(assistant_group)

            account.groups.set(groups)

        return account

    def check_user_instance(self, instance):
        from users import serializers as users_serializers
        instance_mapping = {
            Administrator: ('administrator', users_serializers.AdministratorSerializer, Account.Role.ADMINISTRATOR),
            Specialist: ('specialist', users_serializers.SpecialistSerializer, Account.Role.SPECIALIST),
            Assistant: ('assistant', users_serializers.AssistantSerializer, Account.Role.ASSISTANT),
            Student: ('student', users_serializers.StudentSerializer, Account.Role.STUDENT),
        }

        return instance_mapping.get(type(instance))

    def check_account_role(self, instance):
        from users import serializers
        role_mapping = {
            Account.Role.ADMINISTRATOR: ('administrator', serializers.AdministratorSerializer),
            Account.Role.SPECIALIST: ('specialist', serializers.SpecialistSerializer),
            Account.Role.ASSISTANT: ('assistant', serializers.AssistantSerializer),
            Account.Role.STUDENT: ('student', serializers.StudentSerializer),
        }

        return role_mapping.get(instance.role)

    def set_role(self, user):
        _, _, role = self.check_user_instance(user)

        user.account.role = role
        user.account.save()

        return user


class DAO:
    from schools import serializers as schools_serializers
    def update_training_point(self, registration):
        training_point, _ = TrainingPoint.objects.get_or_create(
            student=registration.student_summary,
            semester=registration.activity.semester,
            criterion=registration.activity.criterion,
        )
        training_point.point = F('point') + registration.activity.point
        training_point.save()

        registration.is_point_added = True
        registration.is_attendance = True
        registration.save()

        return training_point

    def get_achievement(self, total_points):
        if total_points >= 90:
            achievement = 'Xuất sắc'
        elif total_points >= 80:
            achievement = 'Giỏi'
        elif total_points >= 65:
            achievement = 'Khá'
        elif total_points >= 50:
            achievement = 'Trung bình'
        elif total_points >= 35:
            achievement = 'Yếu'
        else:
            achievement = 'Kém'

        return achievement

    def get_student_summary(self, semester=None, student=None):
        training_points = student.points.select_related('criterion').filter(semester=semester).order_by('criterion__name')
        student_total_points = training_points.aggregate(total_points=Sum('point', default=0))['total_points']

        student_summary = {
            'id': student.id,
            'full_name': student.full_name,
            'code': student.code,
            'achievement': self.get_achievement(student_total_points),
            'total_points': student_total_points,
        }

        return student_summary, training_points

    def get_class_summary(self, semester=None, sclass=None):
        students = sclass.students.all()

        class_total_points = 0
        class_total_students = 0

        achievements = {achievement: 0 for achievement in ACHIEVEMENTS}
        students_summary_list = []

        for student in students:
            class_total_students += 1
            student_summary, training_points = self.get_student_summary(semester=semester, student=student)
            class_total_points += student_summary['total_points']
            achievements[student_summary['achievement']] += 1
            student_summary['training_points'] = self.schools_serializers.TrainingPointSerializer(training_points, many=True).data
            students_summary_list.append(student_summary)

        class_average_points = class_total_points / class_total_students if class_total_students > 0 else 0

        class_summary = {
            'id': sclass.id,
            'class_name': sclass.name,
            'total_students': class_total_students,
            'total_points': class_total_points,
            'average_points': class_average_points,
            'achievements': achievements,
            'students': students_summary_list,
        }

        return class_summary

    def get_statistics_points_by_class(self, semester_code, class_name):
        classes = Class.objects.filter(name__icontains=class_name) if class_name else Class.objects.all()
        semester = Semester.objects.get(code=semester_code)

        statistics_data = []

        for sclass in classes:
            class_summary = self.get_class_summary(semester=semester, sclass=sclass)
            statistics_data.append(class_summary)

        return statistics_data

    def get_faculty_summary(self, semester=None, faculty=None):
        students = faculty.students.all()

        faculty_total_classes = faculty.majors.aggregate(total_classes=Count('classes'))['total_classes']
        faculty_total_students = 0
        faculty_total_points = 0

        achievements = {achievement: 0 for achievement in ACHIEVEMENTS}

        for student in students:
            faculty_total_students += 1
            student_summary, training_points = self.get_student_summary(semester=semester, student=student)
            faculty_total_points += student_summary['total_points']
            achievements[student_summary['achievement']] += 1

        faculty_average_points = faculty_total_points / faculty_total_students if faculty_total_students > 0 else 0

        faculty_summary = {
            'id': faculty.id,
            'faculty_name': faculty.name,
            'total_classes': faculty_total_classes,
            'total_students': faculty_total_students,
            'total_points': faculty_total_points,
            'average_points': faculty_average_points,
            'achievements': achievements,
        }

        return faculty_summary

    def get_statistics_points_by_faculty(self, semester_code, faculty_name):
        faculties = Faculty.objects.filter(name__icontains=faculty_name) if faculty_name else Faculty.objects.all()
        semester = Semester.objects.get(code=semester_code) if semester_code else None

        statistics_data = []

        for faculty in faculties:
            faculty_summary = self.get_faculty_summary(semester=semester, faculty=faculty)
            statistics_data.append(faculty_summary)

        return statistics_data

    def get_statistics_points_by_school(self):
        faculties = Faculty.objects.all()

        school_total_faculties = 0
        school_total_classes = 0
        school_total_students = 0
        school_total_points = 0

        achievements = {achievement: 0 for achievement in ACHIEVEMENTS}

        for faculty in faculties:
            faculty_summary = self.get_faculty_summary(faculty=faculty)

            school_total_faculties += 1
            school_total_classes += faculty_summary["total_classes"]
            school_total_students += faculty_summary["total_students"]
            school_total_points += faculty_summary["total_points"]

            for achievement, count in faculty_summary["achievements"].items():
                achievements[achievement] += count

        school_average_points = school_total_points / school_total_students if school_total_students > 0 else 0

        school_summary = {
            "total_faculties": school_total_faculties,
            "total_classes": school_total_classes,
            "total_students": school_total_students,
            "total_points": school_total_points,
            "average_points": school_average_points,
            "achievements": achievements,
        }

        return school_summary


factory = Factory()
dao = DAO()
