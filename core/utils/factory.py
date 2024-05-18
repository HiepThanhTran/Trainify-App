import cloudinary.exceptions
from cloudinary import CloudinaryResource, api, uploader
from django.contrib.auth.models import Group, Permission
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from users.models import Account, Administrator, Assistant, Specialist, Student, User

SPECIALIST_PERMISSIONS = [
    "create_assistant_account",
    "view_faculty_statistics",
    "export_faculty_statistics",
]
ASSISTANT_PERMISSIONS = [
    "view_class_statistics",
    "export_class_statistics",
    "upload_attendance_csv",
    "view_reported_list",
    "view_deficiency_list",
    "resolve_deficiency",
    "add_activity",
    "add_bulletin",
]
STUDENT_PERMISSIONS = [
    "register_activity",
    "report_activity",
    "view_participated_list",
    "view_registered_list",
    "view_trainingpoint",
]
PERMISSIONS = {
    "specialist": Permission.objects.filter(codename__in=SPECIALIST_PERMISSIONS),
    "assistant": Permission.objects.filter(codename__in=ASSISTANT_PERMISSIONS),
    "student": Permission.objects.filter(codename__in=STUDENT_PERMISSIONS),
}
DEFAULT_PUBLIC_ID = {
    "avatar": "default-avatar",
    "bulletin": "bulletin-cover",
    "activity": "activity-image",
}


class Factory:
    def set_permissions_for_account(self, account):
        group_name, _ = self.check_account_role(account)
        if group_name.__eq__("administrator"):
            groups = [
                Group.objects.get_or_create(name="specialist")[0],
                Group.objects.get_or_create(name="assistant")[0],
                Group.objects.get_or_create(name="student")[0],
            ]
            account.groups.set(groups)
        else:
            group, _ = Group.objects.get_or_create(name=group_name)
            groups = [group, ]

            if group_name.__eq__("specialist"):
                assistant_group = Group.objects.get_or_create(name="assistant")[0]
                groups.append(assistant_group)

            group.permissions.set(PERMISSIONS[group_name])
            account.groups.set(groups)

        return account

    def set_role(self, user, account):
        account.role = self.check_user_instance(user)[1]
        account.save()

        return user, account

    def find_user_by_code(self, code=None):
        users = self.get_all_subclasses(User)
        for user in users:
            try:
                return user.objects.get(code=code)
            except user.DoesNotExist:
                continue

        raise ValidationError({"detail": "Không tìm thấy người dùng"})

    def get_all_subclasses(self, cls):
        all_subclasses = []

        for subclass in cls.__subclasses__():
            if not subclass._meta.abstract:
                all_subclasses.append(subclass)
            all_subclasses.extend(self.get_all_subclasses(subclass))

        return all_subclasses

    @staticmethod
    def check_user_instance(user):
        from users import serializers
        instance_mapping = {
            Administrator: (serializers.AdministratorSerializer, Account.Role.ADMINISTRATOR),
            Specialist: (serializers.SpecialistSerializer, Account.Role.SPECIALIST),
            Assistant: (serializers.AssistantSerializer, Account.Role.ASSISTANT),
            Student: (serializers.StudentSerializer, Account.Role.STUDENT),
        }

        return instance_mapping.get(type(user))

    @staticmethod
    def check_account_role(account):
        from users import serializers
        role_mapping = {
            Account.Role.ADMINISTRATOR: ("administrator", serializers.AdministratorSerializer),
            Account.Role.SPECIALIST: ("specialist", serializers.SpecialistSerializer),
            Account.Role.ASSISTANT: ("assistant", serializers.AssistantSerializer),
            Account.Role.STUDENT: ("student", serializers.StudentSerializer),
        }

        return role_mapping.get(account.role)

    @staticmethod
    def get_or_upload(file=None, public_id=None, ftype=None):
        if not file and not public_id and not ftype:
            return None

        if file:
            return uploader.upload_resource(file=file, public_id=public_id, unique_filename=False, overwrite=True)

        if not public_id and ftype:
            public_id = DEFAULT_PUBLIC_ID[ftype]

        try:
            response = api.resource(public_id)
        except (cloudinary.exceptions.NotFound, TypeError):
            return None

        return CloudinaryResource(**{key: response.get(key) for key in ["public_id", "format", "version", "type", "resource_type"]})

    @staticmethod
    def get_paginators_response(paginator=None, request=None, serializer_class=None, data=None):
        page = paginator.paginate_queryset(queryset=data, request=request)
        if page is not None:
            serializer = serializer_class(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = serializer_class(data, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


factory = Factory()
