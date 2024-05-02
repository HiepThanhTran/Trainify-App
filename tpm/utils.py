from django.core.exceptions import ObjectDoesNotExist

from users.models import Administrator, Account, Specialist, Assistant, Student


class Factory:
    def get_instance(self, instance):
        if isinstance(instance, Account):
            return self.get_instance_by_role(instance)

        from users import serializers
        instance_mapping = {
            Administrator: ("administrator", serializers.AdministratorSerializer, Account.Role.ADMIN),
            Specialist: ("specialist", serializers.SpecialistSerializer, Account.Role.SPECIALIST),
            Assistant: ("assistant", serializers.AssistantSerializer, Account.Role.ASSISTANT),
            Student: ("student", serializers.StudentSerializer, Account.Role.STUDENT),
        }

        return instance_mapping.get(type(instance))

    def get_instance_by_role(self, instance):
        from users import serializers
        role_mapping = {
            Account.Role.ADMIN: ("administrator", serializers.AdministratorSerializer),
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

    def find_user(self, key):
        try:
            return Administrator.objects.get(pk=key)
        except ObjectDoesNotExist:
            pass

        try:
            return Specialist.objects.get(pk=key)
        except ObjectDoesNotExist:
            pass

        try:
            return Assistant.objects.get(pk=key)
        except ObjectDoesNotExist:
            pass

        try:
            return Student.objects.get(code=key)
        except ObjectDoesNotExist:
            pass


factory = Factory()
