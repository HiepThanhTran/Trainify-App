import datetime
import json
import os
import re
import time

import unidecode
from django.contrib.auth.hashers import make_password
from django.core.management import call_command
from django.core.management.base import BaseCommand

from activities.models import *
from commands.models import CollectData
from core import settings
from core.utils import factory
from interacts.models import *
from schools.models import *
from users.models import *

DB_DATA_PATH = os.path.join(settings.STATIC_ROOT, 'data/db.json'),

MODEL_DATA_PATH = {
    'EducationalSystem': os.path.join(settings.STATIC_ROOT, 'data/schools/educational_system_data.json'),
    'Faculty': os.path.join(settings.STATIC_ROOT, 'data/schools/faculty_data.json'),
    'Major': os.path.join(settings.STATIC_ROOT, 'data/schools/major_data.json'),
    'AcademicYear': os.path.join(settings.STATIC_ROOT, 'data/schools/academic_year_data.json'),
    'Class': os.path.join(settings.STATIC_ROOT, 'data/schools/class_data.json'),
    'Semester': os.path.join(settings.STATIC_ROOT, 'data/schools/semester_data.json'),
    'Criterion': os.path.join(settings.STATIC_ROOT, 'data/schools/criterion_data.json'),

    'Student': os.path.join(settings.STATIC_ROOT, 'data/users/student_data.json'),
    'Assistant': os.path.join(settings.STATIC_ROOT, 'data/users/assistant_data.json'),
    'Specialist': os.path.join(settings.STATIC_ROOT, 'data/users/specialist_data.json'),

    'Bulletin': os.path.join(settings.STATIC_ROOT, 'data/activities/bulletin_data.json'),
    'Activity': os.path.join(settings.STATIC_ROOT, 'data/activities/activity_data.json'),

    'Comment': os.path.join(settings.STATIC_ROOT, 'data/interacts/comment_data.json'),
    'Like': os.path.join(settings.STATIC_ROOT, 'data/interacts/like_data.json'),
}


class Command(BaseCommand):
    default_password_student = make_password('stu@123')
    default_password_assistant = make_password('asst@123')
    default_password_specialist = make_password('spc@123')
    bulletin_cover = factory.get_image('bulletin-cover')
    activity_image = factory.get_image('activity-image')
    default_avatar = factory.get_image()

    def handle(self, *args, **kwargs):
        call_command('makemigrations', interactive=False)
        call_command('migrate', interactive=False)

        collect_data_list = []

        Account.objects.create_superuser(email='admin@gmail.com', password='admin@123')

        models_list = {
            'EducationalSystem': EducationalSystem,
            'Faculty': Faculty,
            'Major': Major,
            'AcademicYear': AcademicYear,
            'Class': Class,
            'Criterion': Criterion,
            'Student': Student,
            'Semester': Semester,
            'Assistant': Assistant,
            'Specialist': Specialist,
            'Bulletin': Bulletin,
            'Activity': Activity,
        }
        date_fields = ['start_date', 'end_date', 'date_of_birth']
        total_time = time.time()
        for model_name, model_instance in models_list.items():
            if self.is_collected_data(app_label=model_instance._meta.app_label, model_name=model_name.lower()):
                self.stdout.write(f'Data for {model_name} already exists {self.style.ERROR("SKIP")}')
                continue

            model_data = self.process_json_file(MODEL_DATA_PATH[model_name])
            start_time = time.time()
            for data in model_data:
                for date_field in date_fields:
                    if date_field in data:
                        data[date_field] = datetime.datetime.strptime(data[date_field], '%Y-%m-%d').date()

                if model_name.__eq__('Bulletin'):
                    poster = Assistant.objects.order_by('?').first()
                    data['poster'] = poster
                    data['cover'] = self.bulletin_cover

                if model_name.__eq__('Activity'):
                    organizer = Assistant.objects.order_by('?').first()
                    data['organizer'] = organizer
                    data['image'] = self.activity_image

                obj = model_instance.objects.create(**data)

            collect_data_list.append(CollectData(app_label=model_instance._meta.app_label, model_name=model_name.lower(), applied=True))
            self.stdout.write(f'Created data for {model_name} successfully... {self.style.SUCCESS(f"{self.convert_seconds(time.time() - start_time)} OK")}')

        if self.is_collected_data(app_label=SemesterOfStudent._meta.app_label, model_name='semesterofstudent'):
            self.stdout.write(f'Data for SemesterOfStudent already exists {self.style.ERROR("SKIP")}')
        else:
            semesters = Semester.objects.prefetch_related('students').all()
            students = Student.objects.all()
            start_time = time.time()
            for semester in semesters:
                semester.students.set(students)

            collect_data_list.append(CollectData(app_label=SemesterOfStudent._meta.app_label, model_name='semesterofstudent', applied=True))
            self.stdout.write(f'Created data for SemesterOfStudent successfully... {self.style.SUCCESS(f"{self.convert_seconds(time.time() - start_time)} OK")}')

        if self.is_collected_data(app_label=ActivityRegistration._meta.app_label, model_name='activityregistration'):
            self.stdout.write(f'Data for ActivityRegistration already exists {self.style.ERROR("SKIP")}')
        else:
            activities = Activity.objects.prefetch_related('participants').all()
            classes = Class.objects.prefetch_related('students').all()
            start_time = time.time()
            for activity in activities:
                for sclass in classes:
                    students = sclass.students.filter(account__isnull=False).order_by('?')[:10]
                    activity.participants.set(students)

            collect_data_list.append(CollectData(app_label=ActivityRegistration._meta.app_label, model_name='activityregistration', applied=True))
            self.stdout.write(f'Created data for ActivityRegistration successfully... {self.style.SUCCESS(f"{self.convert_seconds(time.time() - start_time)} OK")}')

        if self.is_collected_data(app_label=Account._meta.app_label, model_name='account'):
            self.stdout.write(f'Data for Account already exists {self.style.ERROR("SKIP")}')
        else:
            faculties = Faculty.objects.prefetch_related('students', 'assistants', 'specialists').all()
            start_time = time.time()
            for faculty in faculties:
                classes = Class.objects.filter(major__faculty=faculty)
                for sclass in classes:
                    students = sclass.students.select_related('account').order_by('?')[:15]
                    self.create_accounts_for_users(users=students, password=self.default_password_student, role=Account.Role.STUDENT)

                assistants = faculty.assistants.select_related('account').order_by('?')[:2]
                specialists = faculty.specialists.select_related('account').all()
                self.create_accounts_for_users(users=assistants, password=self.default_password_assistant, role=Account.Role.ASSISTANT)
                self.create_accounts_for_users(users=specialists, password=self.default_password_specialist, role=Account.Role.SPECIALIST)

            collect_data_list.append(CollectData(app_label=Account._meta.app_label, model_name='account', applied=True))
            self.stdout.write(f'Created account for Student successfully... {self.style.SUCCESS(f"{self.convert_seconds(time.time() - start_time)} OK")}')
            self.stdout.write(f'Created account for Assistant of successfully... {self.style.SUCCESS(f"{self.convert_seconds(time.time() - start_time)} OK")}')
            self.stdout.write(f'Created account for Specialist of successfully... {self.style.SUCCESS(f"{self.convert_seconds(time.time() - start_time)} OK")}')

        models_list = {
            'Comment': Comment,
            'Like': Like,
        }
        for model_name, model_instance in models_list.items():
            if self.is_collected_data(app_label=model_instance._meta.app_label, model_name=model_name.lower()):
                self.stdout.write(f'Data for {model_name} already exists {self.style.ERROR("SKIP")}')
                continue

            model_data = self.process_json_file(MODEL_DATA_PATH[model_name])
            start_time = time.time()
            for data in model_data:
                obj = model_instance.objects.create(**data)

            collect_data_list.append(CollectData(app_label=model_instance._meta.app_label, model_name=model_name.lower(), applied=True))
            self.stdout.write(f'Created data for {model_name} successfully... {self.style.SUCCESS(f"{self.convert_seconds(time.time() - start_time)} OK")}')

        CollectData.objects.bulk_create(collect_data_list)
        self.stdout.write(f'- Total time: {self.style.SUCCESS(self.convert_seconds(time.time() - total_time))}')

    def create_accounts_for_users(self, users, password, role):
        for user in users:
            first_name = re.escape(unidecode.unidecode(user.first_name).lower().replace(' ', ''))
            account_data = {'email': f'{user.code}{first_name}@ou.edu.vn', 'password': password, 'role': role, 'avatar': self.default_avatar}

            account = Account.objects.create(**account_data)
            user.account = account
            user.save()

            factory.set_permissions_for_account(account)

    def is_collected_data(self, app_label, model_name):
        return CollectData.objects.filter(app_label=app_label, model_name=model_name, applied=True).exists()

    def process_json_file(self, file):
        f = open(file)
        data = json.load(f)

        return data

    def convert_seconds(self, seconds=0):
        if seconds >= 3600:
            hours = seconds // 3600
            minutes = (seconds % 3600) // 60
            remaining_seconds = round(seconds % 60, 2)
            return f'{hours}h {minutes}m {remaining_seconds}s'

        if seconds >= 60:
            minutes = seconds // 60
            remaining_seconds = seconds % 60
            return f'{minutes}m {remaining_seconds}s'

        return f'{round(seconds, 2)}s'
