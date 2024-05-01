from rest_framework import serializers

from tpm.serializers import BaseSerializer
from tpm.utils import find_user, set_role
from users.models import Account, Student, Specialist, Assistant


class AccountSerializer(BaseSerializer):
    key = serializers.CharField(write_only=True, required=True, allow_blank=False, allow_null=False)

    class Meta:
        model = Account
        fields = ["id", "role", "email", "password", "avatar", "key"]
        extra_kwargs = {
            "password": {
                "write_only": "true",
            },
            "role": {
                "read_only": "true",
            }
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)

        avatar = data.get("avatar", None)
        if avatar:
            data["avatar"] = instance.avatar.url

        return data

    def create(self, validated_data):
        key = validated_data.pop("key")

        user = find_user(key)

        if user is None:
            error_message = {"message": "Không tìm thấy người dùng."}
            raise serializers.ValidationError(error_message)

        if user.account is not None:
            error_message = {"message": "Người dùng này đã đăng ký tài khoản!"}
            raise serializers.ValidationError(error_message)

        account = Account.objects.create(**validated_data)
        account.set_password(validated_data["password"])
        account.save()

        user.account = account
        user.save()
        set_role(user)

        return account


class UserSerializer(serializers.Serializer):
    class Meta:
        fields = [
            "id", "first_name", "middle_name", "last_name", "gender",
            "date_of_birth", "faculty", "address", "phone_number", "account",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["faculty"] = instance.faculty.name

        return data


class OfficerSerializer(UserSerializer):
    class Meta:
        fields = UserSerializer.Meta.fields


class SpecialistSerializer(BaseSerializer, OfficerSerializer):
    class Meta:
        model = Specialist
        fields = OfficerSerializer.Meta.fields + [
            "job_title", "academic_degree",
        ]


class AssistantSerializer(BaseSerializer, OfficerSerializer):
    class Meta:
        model = Assistant
        fields = OfficerSerializer.Meta.fields


class StudentSerializer(BaseSerializer, UserSerializer):
    class Meta:
        model = Student
        fields = UserSerializer.Meta.fields + [
            "code", "major", "class_name", "academic_year", "educational_system",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["educational_system"] = instance.educational_system.name
        data["academic_year"] = instance.educational_system.name
        data["class_name"] = instance.class_name.name
        data["major"] = instance.major.name

        return data
