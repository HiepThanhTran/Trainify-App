from rest_framework import serializers

from schools.models import EducationalSystem, Faculty, Major, AcademicYear, Class, Semester, Criterion, TrainingPoint, DeficiencyReport


class EducationalSystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationalSystem
        fields = ["id", "name", "is_active", "created_date"]


class FacultySerializer(serializers.ModelSerializer):
    educational_system = EducationalSystemSerializer()

    class Meta:
        model = Faculty
        fields = ["id", "name", "educational_system", "is_active", "created_date"]


class MajorSerializer(serializers.ModelSerializer):
    faculty = FacultySerializer()

    class Meta:
        model = Major
        fields = ["id", "name", "faculty", "is_active", "created_date"]


class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ["id", "academic_year", "start_date", "end_date"]


class ClassSerializer(serializers.ModelSerializer):
    major = MajorSerializer()
    academic_year = AcademicYearSerializer()

    class Meta:
        model = Class
        fields = ["id", "name", "major", "academic_year", "is_active"]


class SemesterSerializer(serializers.ModelSerializer):
    academic_year = AcademicYearSerializer()

    class Meta:
        model = Semester
        fields = ["id", "name", "start_date", "end_date", "academic_year"]


class CriterionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criterion
        fields = ["id", "name", "description", "is_active", "created_date"]


class TrainingPointSerializer(serializers.ModelSerializer):
    # criterion = CriterionSerializer()
    # student = StudentSerializer()
    # semester = SemesterSerializer()

    class Meta:
        model = TrainingPoint
        fields = ["id", "point", "criterion", "student", "semester"]


class DeficiencyReportSerializer(serializers.Serializer):
    # student = StudentSerializer()
    # activity = ""

    class Meta:
        model = DeficiencyReport
        fields = ["id", "is_resolved", "image", "content", "student", "activity", "created_date", "updated_date"]
