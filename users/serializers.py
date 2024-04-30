from rest_framework import serializers

from tpm.serializers import BaseSerializer
from users.models import Account, Student, Administrator, Specialist, Assistant


class AccountSerializer(BaseSerializer):
    class Meta:
        model = Account
        fields = ["id", "email", "username", "password", "role", "avatar", ]
        extra_kwargs = {
            "password": {
                "write_only": "true"
            }
        }

    def create(self, validated_data):
        data = validated_data.copy()
        account = Account(**data)
        account.set_password(account.password)
        account.save()

        return account


class UserSerializer(serializers.Serializer):
    id = serializers.CharField()
    code = serializers.CharField()
    gender = serializers.CharField()
    address = serializers.CharField()
    last_name = serializers.CharField()
    first_name = serializers.CharField()
    middle_name = serializers.CharField()
    phone_number = serializers.CharField()
    date_of_birth = serializers.DateField()

    faculty = serializers.CharField(source="faculty.name")

    class Meta:
        fields = [
            "id", 'code', "first_name", "middle_name", "last_name", "gender",
            "date_of_birth", "faculty", "address", "phone_number",
        ]


class AdministratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrator
        fields = UserSerializer.Meta.fields


class AssistantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assistant
        fields = UserSerializer.Meta.fields


class SpecialistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialist
        fields = AssistantSerializer.Meta.fields + ["job_title", "academic_degree", ]


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = UserSerializer.Meta.fields + ["major", "class_name", "academic_year", "educational_system", ]
