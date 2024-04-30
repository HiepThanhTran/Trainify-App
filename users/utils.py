from django.core.exceptions import ObjectDoesNotExist

from users.models import Administrator, Account, Specialist, Assistant, Student


def set_role(instance):
    role_mapping = {
        Administrator: Account.Role.ADMIN,
        Specialist: Account.Role.SPECIALIST,
        Assistant: Account.Role.ASSISTANT,
        Student: Account.Role.STUDENT,
    }

    role = role_mapping.get(type(instance))
    if role is None:
        raise ValueError("Invalid user instance.")

    instance.account.role = role
    instance.account.save()

    return instance


def find_user(key):
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

    return None
