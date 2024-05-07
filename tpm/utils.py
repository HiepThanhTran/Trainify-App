from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q

from users.models import Administrator, Account, Specialist, Assistant, Student


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

        return account

    def get_instance(self, instance):
        if isinstance(instance, Account):
            return self.get_instance_by_role(instance)

        from users import serializers as users_serializers
        instance_mapping = {
            Administrator: ("administrator", users_serializers.AdministratorSerializer, Account.Role.ADMINISTRATOR),
            Specialist: ("specialist", users_serializers.SpecialistSerializer, Account.Role.SPECIALIST),
            Assistant: ("assistant", users_serializers.AssistantSerializer, Account.Role.ASSISTANT),
            Student: ("student", users_serializers.StudentSerializer, Account.Role.STUDENT),
        }

        return instance_mapping.get(type(instance))

    def get_instance_by_role(self, instance):
        from users import serializers
        role_mapping = {
            Account.Role.ADMINISTRATOR: ("administrator", serializers.AdministratorSerializer),
            Account.Role.SPECIALIST: ("specialist", serializers.SpecialistSerializer),
            Account.Role.ASSISTANT: ("assistant", serializers.AssistantSerializer),
            Account.Role.STUDENT: ("student", serializers.StudentSerializer),
        }

        instance_role = role_mapping.get(instance.role)
        if instance_role is None:
            raise ValueError("Invalid user instance.")

        return instance_role

    def set_role(self, instance):
        _, _, role = self.get_instance(instance)

        if role is None:
            raise ValueError("Invalid user instance.")

        instance.account.role = role
        instance.account.save()

        return instance


factory = Factory()
