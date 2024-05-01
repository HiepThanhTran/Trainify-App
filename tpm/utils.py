import csv

from django.core.exceptions import ObjectDoesNotExist

from schools.models import Participation
from users.models import Administrator, Account, Specialist, Assistant, Student


def handle_csv_upload(file):
    csv_data = csv.reader(file)
    for row in csv_data:
        student_code, activity_id, is_attendance = row
        student = Student.objects.get(code=student_code)
        Participation.objects.update_or_create(
            student=student, activity_id=activity_id, defaults={'is_attendance': is_attendance}
        )


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
