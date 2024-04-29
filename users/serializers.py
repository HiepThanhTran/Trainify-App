from rest_framework import serializers

from schools.serializers import FacultySerializer
from tpm.serializers import BaseSerializer
from users.models import Account, Officer, Student


class UserSerializer(serializers.Serializer):
    id = serializers.CharField()
    gender = serializers.CharField()
    address = serializers.CharField()
    last_name = serializers.CharField()
    first_name = serializers.CharField()
    middle_name = serializers.CharField()
    phone_number = serializers.CharField()
    date_of_birth = serializers.DateField()

    faculty = FacultySerializer(source="name", read_only=True)

    class Meta:
        fields = [
            "id", "first_name", "middle_name", "last_name", "gender",
            "date_of_birth", "faculty", "address", "phone_number",
        ]


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


class OfficerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Officer
        fields = UserSerializer.Meta.fields + ["job_title", "academic_degree", ]


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = UserSerializer.Meta.fields + ["student_code", "major", "class_name", "academic_year", "educational_system", ]
