from django.db.models import Case, When, F, IntegerField, Sum, Count

from schools.models import Faculty, Class, TrainingPoint
from users.models import Student

ACHIEVEMENTS = ['Xuất sắc', 'Giỏi', 'Khá', 'Trung bình', 'Yếu', 'Kém']


class DAO:
    from schools import serializers as schools_serializers

    def get_statistics(self, semester, faculty, sclass):
        if faculty and not sclass:
            return self.get_statistics_faculty(semester=semester, faculty=faculty)

        return self.get_statistics_class(semester=semester, sclass=sclass)

    def get_statistics_points_of_school(self):
        school_total_faculties = Faculty.objects.count()
        school_total_classes = Class.objects.count()
        school_total_students = Student.objects.count()

        school_summary = {
            "total_faculties": school_total_faculties,
            "total_classes": school_total_classes,
            "total_students": school_total_students,
        }

        return school_summary

    def get_statistics_student(self, semester=None, student=None):
        training_points = student.points.filter(semester=semester).only('point').order_by('criterion__name') \
            .annotate(adjusted_point=Case(When(point__gt=F('criterion__max_point'), then=F('criterion__max_point')), default=F('point'), output_field=IntegerField()))
        student_total_points = training_points.aggregate(total_points=Sum('adjusted_point', default=0))['total_points']

        student_summary = {
            'id': student.id,
            'full_name': student.full_name,
            'code': student.code,
            'achievement': self.get_achievement(student_total_points),
            'total_points': student_total_points,
            'training_points': self.schools_serializers.TrainingPointSerializer(training_points, many=True).data
        }

        return student_summary, training_points

    def get_statistics_class(self, semester=None, sclass=None):
        students_summary_list = []
        class_total_students, class_total_points = 0, 0
        achievements = {achievement: 0 for achievement in ACHIEVEMENTS}

        students = sclass.students.all()
        for student in students:
            student_summary, _ = self.get_statistics_student(semester=semester, student=student)
            class_total_students += 1
            class_total_points += student_summary['total_points']
            achievements[student_summary['achievement']] += 1
            students_summary_list.append(student_summary)

        class_average_points = round(class_total_points / class_total_students if class_total_students > 0 else 0, 2)

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

    def get_statistics_faculty(self, semester=None, faculty=None):
        faculty_total_classes = faculty.majors.aggregate(total_classes=Count('classes'))['total_classes']
        faculty_total_students, faculty_total_points = 0, 0
        achievements = {achievement: 0 for achievement in ACHIEVEMENTS}

        students = faculty.students.all()
        for student in students:
            student_summary, _ = self.get_statistics_student(semester=semester, student=student)
            faculty_total_students += 1
            faculty_total_points += student_summary['total_points']
            achievements[student_summary['achievement']] += 1

        faculty_average_points = round(faculty_total_points / faculty_total_students if faculty_total_students > 0 else 0, 2)

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

    @staticmethod
    def get_achievement(total_points):
        if total_points >= 90:
            return 'Xuất sắc'
        if total_points >= 80:
            return 'Giỏi'
        if total_points >= 65:
            return 'Khá'
        if total_points >= 50:
            return 'Trung bình'
        if total_points >= 35:
            return 'Yếu'

        return 'Kém'

    @staticmethod
    def update_registration(registration):
        training_point, _ = TrainingPoint.objects.get_or_create(
            student=registration.student,
            semester=registration.activity.semester,
            criterion=registration.activity.criterion
        )
        training_point.point = F('point') + registration.activity.point
        training_point.save()

        registration.is_point_added = True
        registration.is_attendance = True
        registration.save()

        return training_point


dao = DAO()
