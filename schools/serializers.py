from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers

from schools.models import EducationalSystem, Faculty, Major, AcademicYear, Class, Semester, Criterion, TrainingPoint, DeficiencyReport, Activity, Participation
from tpm.serializers import BaseSerializer
from tpm.utils import find_user
from users.models import Specialist, Assistant, Account


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
        fields = ["id", "name", "start_date", "end_date", "academic_year"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["academic_year"] = instance.academic_year.name

        return data


class CriterionSerializer(BaseSerializer):
    class Meta:
        model = Criterion
        fields = ["id", "name", "max_point", "description", "is_active", "created_date", "updated_date"]


class TrainingPointSerializer(BaseSerializer):
    from users import serializers as user_serializers
    student = user_serializers.StudentSerializer()

    class Meta:
        model = TrainingPoint
        fields = ["id", "point", "criterion", "semester", "student"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["semester"] = instance.semester.name
        data["criterion"] = instance.criterion.name

        return data


class ActivitySerializer(BaseSerializer):
    from users import serializers as user_serializers
    list_of_participants = user_serializers.StudentSerializer(many=True, required=False)

    created_by = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        exclude = ["created_by_type", "created_by_id"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")

        if not (request and request.user.is_authenticated and request.user.has_in_activities_group()):
            data.pop("list_of_participants")

        data['criterion'] = instance.criterion.name
        data['semester'] = instance.semester.name
        data['faculty'] = instance.faculty.name

        return data

    def create(self, validated_data):
        data = validated_data.copy()
        request = self.context.get("request")

        user_mapping = {
            Account.Role.ADMIN: "administrator",
            Account.Role.SPECIALIST: "specialist",
            Account.Role.ASSISTANT: "assistant",
        }
        user_attr = user_mapping.get(request.user.role)
        user_instance = getattr(request.user, user_attr, None)

        if user_instance:
            content_type = ContentType.objects.get_for_model(user_instance)
            data["created_by_type"] = content_type
            data["created_by_id"] = user_instance.id

        activity = Activity.objects.create(**data)

        return activity

    def get_created_by(self, activity):
        user = find_user(activity.created_by_id)

        from users import serializers as user_serializers
        instance_mapping = {
            Specialist: user_serializers.SpecialistSerializer,
            Assistant: user_serializers.AssistantSerializer,
        }
        serializer_class = instance_mapping.get(user)

        if serializer_class:
            return serializer_class(activity.created_by).data


class ParticipationSerializer(BaseSerializer):
    from users import serializers as user_serializers
    student = user_serializers.StudentSerializer()
    activity = ActivitySerializer()

    class Meta:
        model = Participation
        fields = "__all__"


class DeficiencyReportSerializer(BaseSerializer):
    from users import serializers as user_serializers
    student = user_serializers.StudentSerializer()
    activity = ActivitySerializer()

    class Meta:
        model = DeficiencyReport
        fields = ["id", "is_resolved", "image", "content", "student", "activity", "created_date", "updated_date"]
        extra_kwargs = {
            "is_resolved": {
                "read_only": "true",
            }
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)

        image = data.get("image", None)
        if image:
            data["image"] = instance.image.url

        return data
