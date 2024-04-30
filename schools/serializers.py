from rest_framework import serializers

from schools.models import EducationalSystem, Faculty, Major, AcademicYear, Class, Semester, Criterion, TrainingPoint, DeficiencyReport, Activity, StudentActivity
from users.models import Specialist
from users.serializers import StudentSerializer, SpecialistSerializer, AssistantSerializer


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
        fields = ["id", "name", "start_date", "end_date"]


class ClassSerializer(serializers.ModelSerializer):
    major = serializers.CharField(source='major.name')

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
        fields = ["id", "name", 'max_point', "description", "is_active", "created_date", 'updated_date']


class TrainingPointSerializer(serializers.ModelSerializer):
    criterion = CriterionSerializer()
    semester = SemesterSerializer()
    student = StudentSerializer()

    class Meta:
        model = TrainingPoint
        fields = ["id", "point", "criterion", "semester", "student"]


class ActivitySerializer(serializers.ModelSerializer):
    faculty = serializers.CharField(source='faculty.name')
    created_by = serializers.SerializerMethodField()

    list_of_participants = StudentSerializer(many=True)
    criterion = CriterionSerializer()
    semester = SemesterSerializer()

    def get_created_by(self, obj):
        if isinstance(obj.created_by, Specialist):
            return SpecialistSerializer(obj.created_by).data

        return AssistantSerializer(obj.created_by).data

    class Meta:
        model = Activity
        fields = "__all__"


class StudentActivitySerializer(serializers.ModelSerializer):
    activity = ActivitySerializer()
    student = StudentSerializer()

    class Meta:
        model = StudentActivity
        fields = "__all__"


class DeficiencyReportSerializer(serializers.ModelSerializer):
    activity = ActivitySerializer()
    student = StudentSerializer()

    class Meta:
        model = DeficiencyReport
        fields = ["id", "is_resolved", "image", "content", "student", "activity", "created_date", "updated_date"]
