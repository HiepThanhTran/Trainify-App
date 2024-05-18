from django.db.models import Case, Count, F, IntegerField, Sum, When

from schools.models import TrainingPoint

ACHIEVEMENTS = ["Xuất sắc", "Giỏi", "Khá", "Trung bình", "Yếu", "Kém"]


class DAO:

    def get_statistics(self, semester=None, faculty=None, sclass=None):
        if faculty and not sclass:
            return self.get_summary(semester=semester, entity=faculty, entity_type="faculty")

        return self.get_summary(semester=semester, entity=sclass, entity_type="class")

    def statistics_student(self, semester=None, student=None):
        training_points = student.points.filter(semester=semester) \
            .select_related('criterion') \
            .values('id', 'point') \
            .annotate(
            max_point=F('criterion__max_point'), criterion=F('criterion__name'),
            adjusted_point=Case(When(point__gt=F("max_point"), then=F("max_point")), default=F("point"), output_field=IntegerField())) \
            .order_by("criterion__name")
        student_total_points = training_points.aggregate(total_points=Sum("adjusted_point", default=0))["total_points"]

        student_summary = {
            "id": student.id,
            "full_name": student.full_name,
            "code": student.code,
            "total_points": student_total_points,
            "achievement": self.get_achievement(student_total_points),
            "training_points": training_points,
        }

        return student_summary, training_points

    def get_summary(self, semester=None, entity=None, entity_type="class"):
        achievements = {achievement: 0 for achievement in ACHIEVEMENTS}
        total_students, total_points = 0, 0

        students = entity.students.prefetch_related('points').all()
        for student in students:
            student_summary, _ = self.statistics_student(semester=semester, student=student)
            total_students += 1
            total_points += student_summary["total_points"]
            achievements[student_summary["achievement"]] += 1
        average_points = round((total_points / total_students if total_students > 0 else 0), 2)

        summary = {
            "id": entity.id,
            "name": entity.name,
            "total_students": total_students,
            "total_points": total_points,
            "average_points": average_points,
            "achievements": achievements,
        }

        if entity_type == "faculty":
            summary["total_classes"] = entity.majors.aggregate(total_classes=Count("classes"))["total_classes"]

        return summary

    @staticmethod
    def get_achievement(total_points):
        if total_points >= 90:
            return "Xuất sắc"
        if total_points >= 80:
            return "Giỏi"
        if total_points >= 65:
            return "Khá"
        if total_points >= 50:
            return "Trung bình"
        if total_points >= 35:
            return "Yếu"

        return "Kém"

    @staticmethod
    def update_registration(registration):
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


dao = DAO()
