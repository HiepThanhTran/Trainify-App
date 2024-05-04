from rest_framework import serializers

from schools.models import EducationalSystem, Faculty, Major, AcademicYear, Class, Semester, Criterion, TrainingPoint
from tpm.serializers import BaseSerializer


class EducationalSystemSerializer(BaseSerializer):
    class Meta:
        model = EducationalSystem
        fields = [
            "id", "name", "is_active", "created_date", "updated_date"
        ]


class FacultySerializer(BaseSerializer):
    class Meta:
        model = Faculty
        fields = ["id", "name", "educational_system", "is_active", "created_date", "updated_date"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["educational_system"] = instance.educational_system.name

        return data


class MajorSerializer(BaseSerializer):
    class Meta:
        model = Major
        fields = ["id", "name", "faculty", "is_active", "created_date"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["faculty"] = instance.faculty.name

        return data


class AcademicYearSerializer(BaseSerializer):
    class Meta:
        model = AcademicYear
        fields = ["id", "name", "start_date", "end_date"]


class ClassSerializer(BaseSerializer):
    class Meta:
        model = Class
        fields = ["id", "name", "major", "academic_year", "is_active"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["academic_year"] = instance.academic_year.name
        data["major"] = instance.major.name

        return data


class SemesterSerializer(BaseSerializer):
    class Meta:
        model = Semester
        fields = "__all__"  # ["id", "name", "start_date", "end_date", "academic_year"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["academic_year"] = instance.academic_year.name

        return data


class CriterionSerializer(BaseSerializer):
    class Meta:
        model = Criterion
        fields = ["id", "name", "max_point", "description", "is_active", "created_date", "updated_date"]


class TrainingPointSerializer(BaseSerializer):
    class Meta:
        model = TrainingPoint
        fields = ["id", "criterion", "point"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["criterion"] = instance.criterion.name

        return data


class TrainingPointBySemesterSerializer(serializers.Serializer):
    semester = serializers.CharField()
    total_point = serializers.IntegerField()
    training_points = TrainingPointSerializer(many=True)
