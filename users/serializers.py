from rest_framework import serializers

from tpm.serializers import BaseSerializer
from tpm.utils import factory
from users.models import Account, Student, Specialist, Assistant, Administrator, User


class AccountSerializer(BaseSerializer):
    key = serializers.CharField(write_only=True, required=True, allow_blank=False, allow_null=False)

    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Account
        fields = ['id', 'role', 'email', 'password', 'avatar', 'date_joined', 'last_login', 'user', 'key']
        extra_kwargs = {
            'password': {
                'write_only': True,
            },
            'role': {
                'read_only': True,
            },
            'date_joined': {
                'read_only': True,
            },
            'last_login': {
                'read_only': True,
            },
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)

        avatar = data.get('avatar', None)
        if 'avatar' in self.fields and avatar:
            data['avatar'] = instance.avatar.url

        return data

    def get_user(self, account):
        instance, serializer_class = factory.check_account_role(account)
        user_instance = getattr(account, instance, None)

        return serializer_class(user_instance).data


class UserSerializer(BaseSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'faculty', 'gender', 'date_of_birth', 'address', 'phone_number']

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if 'faculty' in self.fields and instance.faculty:
            data['faculty'] = instance.faculty.name

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
        fields = OfficerSerializer.Meta.fields + ['job_title', 'academic_degree']


class AssistantSerializer(OfficerSerializer):
    class Meta:
        model = Assistant
        fields = OfficerSerializer.Meta.fields


class StudentSerializer(UserSerializer):
    class Meta:
        model = Student
        fields = UserSerializer.Meta.fields + ['code', 'major', 'sclass', 'academic_year', 'educational_system']

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if 'major' in self.fields:
            data['major'] = instance.major.name

        if 'sclass' in self.fields:
            data['sclass'] = instance.sclass.name

        if 'academic_year' in self.fields:
            data['academic_year'] = instance.academic_year.name

        if 'educational_system' in self.fields:
            data['educational_system'] = instance.educational_system.name

        return data
