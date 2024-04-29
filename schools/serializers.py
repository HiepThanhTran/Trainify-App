from rest_framework import serializers

from schools.models import EducationalSystem, Faculty, Major, AcademicYear, Class, Semester, Criterion, TrainingPoint, DeficiencyReport, Activity, StudentActivity
from users.serializers import OfficerSerializer, StudentSerializer


class EducationalSystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationalSystem
        fields = [
            "id", "name", "is_active", "created_date", "updated_date"
        ]


class FacultySerializer(serializers.ModelSerializer):
    educational_system = serializers.CharField(source='educational_system.name')

    class Meta:
        model = Faculty
        fields = [
            "id", "name", "educational_system", "is_active", "created_date", "updated_date"
        ]


class MajorSerializer(serializers.ModelSerializer):
    faculty = serializers.CharField(source='faculty.name')

    class Meta:
        model = Major
        fields = ["id", "name", "faculty", "is_active", "created_date"]


class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ["id", "academic_year", "start_date", "end_date"]


class ClassSerializer(serializers.ModelSerializer):
    academic_year = AcademicYearSerializer()
    major = serializers.CharField(source='major.name')

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
        fields = ["id", "name", 'max_point', "description", "is_active", "created_date", 'updated_date']


class TrainingPointSerializer(serializers.ModelSerializer):
    import users.serializers as users_serializers
    criterion = CriterionSerializer()
    semester = SemesterSerializer()
    student = users_serializers.StudentSerializer()

    class Meta:
        model = TrainingPoint
        fields = ["id", "point", "criterion", "semester", "student"]


class ActivitySerializer(serializers.ModelSerializer):
    faculty = serializers.CharField(source='faculty.name')

    semester = SemesterSerializer()
    created_by = OfficerSerializer()
    criterion = CriterionSerializer()
    list_of_participants = StudentSerializer(many=True)

    class Meta:
        model = Activity
        fields = "__all__"


class StudentActivitySerializer(serializers.ModelSerializer):
    student = StudentSerializer()
    activity = ActivitySerializer()

    class Meta:
        model = StudentActivity
        fields = "__all__"


class DeficiencyReportSerializer(serializers.ModelSerializer):
    activity = ActivitySerializer()
    student = StudentSerializer()

    class Meta:
        model = DeficiencyReport
        fields = ["id", "is_resolved", "image", "content", "student", "activity", "created_date", "updated_date"]
