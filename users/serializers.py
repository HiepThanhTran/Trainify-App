from rest_framework import serializers

from tpm.serializers import BaseSerializer
from users.models import Account, Student, Specialist, Assistant


class AccountSerializer(BaseSerializer):
    user = serializers.SerializerMethodField(required=False)

    def get_user(self, account):
        role_serializer_map = {
            Account.Role.SPECIALIST: (SpecialistSerializer, 'specialist'),
            Account.Role.ASSISTANT: (AssistantSerializer, 'assistant'),
            Account.Role.STUDENT: (StudentSerializer, 'student'),
        }

        serializer_class, user_attr = role_serializer_map.get(account.role, (None, None))
        if serializer_class and user_attr:
            user_instance = getattr(account, user_attr, None)
            if user_instance:
                serializer = serializer_class(user_instance)
                return serializer.data
        return None

    class Meta:
        model = Account
        fields = ["id", "email", "password", "avatar", "user"]
        extra_kwargs = {
            "password": {
                "write_only": "true"
            }
        }


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    code = serializers.CharField()
    gender = serializers.CharField()
    address = serializers.CharField()
    last_name = serializers.CharField()
    first_name = serializers.CharField()
    middle_name = serializers.CharField()
    phone_number = serializers.CharField()
    date_of_birth = serializers.DateField()

    faculty = serializers.SerializerMethodField()

    def get_faculty(self, obj):
        return obj.faculty.name if obj.faculty else None

    class Meta:
        fields = [
            "id", "first_name", "middle_name", "last_name", "gender",
            "date_of_birth", "faculty", "address", "phone_number",
        ]


class OfficerSerializer(serializers.Serializer):
    faculty = serializers.SerializerMethodField()

    def get_faculty(self, obj):
        return obj.faculty.name if obj.faculty else None

    class Meta:
        fields = UserSerializer.Meta.fields


class SpecialistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialist
        fields = OfficerSerializer.Meta.fields + ["job_title", "academic_degree"]


class AssistantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assistant
        fields = OfficerSerializer.Meta.fields


class StudentSerializer(serializers.ModelSerializer):
    educational_system = serializers.CharField(source='educational_system.name')
    academic_year = serializers.CharField(source='academic_year.name')
    class_name = serializers.CharField(source='class_name.name')
    major = serializers.CharField(source='major.name')

    faculty = serializers.SerializerMethodField()

    def get_faculty(self, obj):
        return obj.faculty.name if obj.faculty else None

    class Meta:
        model = Student
        fields = UserSerializer.Meta.fields + ["code", "major", "class_name", "academic_year", "educational_system"]
