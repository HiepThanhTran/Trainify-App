from rest_framework import serializers

from tpm.serializers import BaseSerializer
from tpm.utils import factory
from users.models import Account, Student, Specialist, Assistant, Administrator, User


class AccountSerializer(BaseSerializer):
    key = serializers.CharField(write_only=True, required=True, allow_blank=False, allow_null=False)

    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Account
        fields = ["id", "role", "key", "email", "password", "avatar", "user"]
        extra_kwargs = {
            "password": {
                "write_only": True,
            },
            "role": {
                "read_only": True,
            }
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)

        avatar = data.get("avatar", None)
        if avatar is not None:
            data["avatar"] = instance.avatar.url

        return data

    def get_user(self, account):
        instance, serializer_class = factory.get_instance_by_role(account)
        user_instance = getattr(account, instance, None)

        if user_instance:
            return serializer_class(user_instance).data


class UserSerializer(BaseSerializer):
    class Meta:
        model = User
        fields = [
            "id", "first_name", "middle_name", "last_name", "gender",
            "date_of_birth", "faculty", "address", "phone_number"
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.faculty:
            data["faculty"] = instance.faculty.name

        return data


class OfficerSerializer(UserSerializer):
    class Meta:
        fields = UserSerializer.Meta.fields


class AdministratorSerializer(OfficerSerializer):
    class Meta:
        model = Administrator
        fields = OfficerSerializer.Meta.fields


class SpecialistSerializer(OfficerSerializer):
    class Meta:
        model = Specialist
        fields = OfficerSerializer.Meta.fields + [
            "job_title", "academic_degree",
        ]


class AssistantSerializer(OfficerSerializer):
    class Meta:
        model = Assistant
        fields = OfficerSerializer.Meta.fields


class StudentSerializer(UserSerializer):
    class Meta:
        model = Student
        fields = UserSerializer.Meta.fields + [
            "student_code", "major", "class_name", "academic_year", "educational_system",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["educational_system"] = instance.educational_system.name
        data["academic_year"] = instance.academic_year.name
        data["class_name"] = instance.class_name.name
        data["major"] = instance.major.name

        return data
