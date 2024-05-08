from django.contrib.auth.models import Permission, Group
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q

from users.models import Administrator, Account, Specialist, Assistant, Student

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
]

STUDENT_PERMISSIONS = [
    "register_activity",
    "report_activity",
    "view_participated_list",
    "view_registered_list",
    "view_trainingpoint",
]


class Factory:
    def create_user_account(self, data, key, user_model):
        try:
            user = user_model.objects.get(Q(pk=key) | Q(student_code=key))
        except ObjectDoesNotExist:
            return None

        if user.account is not None:
            return None

        account = Account.objects.create(**data)
        account.set_password(account.password)
        account.save()

        user.account = account
        user.save()

        self.set_role(user)
        self.set_permissions_for_account(account)

        return account

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
            group, created = Group.objects.get_or_create(name=group_name)
            groups = [group, ]

            if created:
                if group_name.__eq__("student"):
                    permissions = Permission.objects.filter(codename__in=STUDENT_PERMISSIONS)
                    group.permissions.set(permissions)
                elif group_name.__eq__("assistant"):
                    permissions = Permission.objects.filter(codename__in=ASSISTANT_PERMISSIONS)
                    group.permissions.set(permissions)
                elif group_name.__eq__("specialist"):
                    permissions = Permission.objects.filter(codename__in=SPECIALIST_PERMISSIONS)
                    group.permissions.set(permissions)
                    assistant_group, _ = Group.objects.get_or_create(name="assistant")
                    groups.append(assistant_group)

            account.groups.set(groups)

        return account

    @staticmethod
    def check_user_instance(instance):
        from users import serializers as users_serializers
        instance_mapping = {
            Administrator: ("administrator", users_serializers.AdministratorSerializer, Account.Role.ADMINISTRATOR),
            Specialist: ("specialist", users_serializers.SpecialistSerializer, Account.Role.SPECIALIST),
            Assistant: ("assistant", users_serializers.AssistantSerializer, Account.Role.ASSISTANT),
            Student: ("student", users_serializers.StudentSerializer, Account.Role.STUDENT),
        }

        return instance_mapping.get(type(instance))

    @staticmethod
    def check_account_role(instance):
        from users import serializers
        role_mapping = {
            Account.Role.ADMINISTRATOR: ("administrator", serializers.AdministratorSerializer),
            Account.Role.SPECIALIST: ("specialist", serializers.SpecialistSerializer),
            Account.Role.ASSISTANT: ("assistant", serializers.AssistantSerializer),
            Account.Role.STUDENT: ("student", serializers.StudentSerializer),
        }

        return role_mapping.get(instance.role)

    def set_role(self, user):
        _, _, role = self.check_user_instance(user)

        user.account.role = role
        user.account.save()

        return user


factory = Factory()
