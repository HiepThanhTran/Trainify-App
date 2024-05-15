import datetime
import json
import os
import re
import time

import unidecode
from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
from django.db import transaction

from activities.models import *
from commands.models import CollectData
from core import settings
from core.utils.factory import factory
from interacts.models import *
from schools.models import *
from users.models import *

DB_DATA_PATH = os.path.join(settings.STATIC_ROOT, 'data/db.json'),

MODEL_DATA_PATH = {
    'EducationalSystem': os.path.join(settings.BASE_DIR, 'static/data/schools/educational_system_data.json'),
    'Faculty': os.path.join(settings.BASE_DIR, 'static/data/schools/faculty_data.json'),
    'Major': os.path.join(settings.BASE_DIR, 'static/data/schools/major_data.json'),
    'AcademicYear': os.path.join(settings.BASE_DIR, 'static/data/schools/academic_year_data.json'),
    'Class': os.path.join(settings.BASE_DIR, 'static/data/schools/class_data.json'),
    'Semester': os.path.join(settings.BASE_DIR, 'static/data/schools/semester_data.json'),
    'Criterion': os.path.join(settings.BASE_DIR, 'static/data/schools/criterion_data.json'),

    'Student': os.path.join(settings.BASE_DIR, 'static/data/users/student_data.json'),
    'Assistant': os.path.join(settings.BASE_DIR, 'static/data/users/assistant_data.json'),
    'Specialist': os.path.join(settings.BASE_DIR, 'static/data/users/specialist_data.json'),

    'Bulletin': os.path.join(settings.BASE_DIR, 'static/data/activities/bulletin_data.json'),
    'Activity': os.path.join(settings.BASE_DIR, 'static/data/activities/activity_data.json'),

    'Comment': os.path.join(settings.BASE_DIR, 'static/data/interacts/comment_data.json'),
    'Like': os.path.join(settings.BASE_DIR, 'static/data/interacts/like_data.json'),
}


class Command(BaseCommand):
    default_password = make_password('user@123')
    bulletin_cover = factory.get_or_upload(ftype='bulletin')
    activity_image = factory.get_or_upload(ftype='activity')
    default_avatar = factory.get_or_upload(ftype='avatar')

    def handle(self, *args, **kwargs):
        Account.objects.create_superuser(email='admin@gmail.com', password='admin@123')

        date_fields = ['start_date', 'end_date', 'date_of_birth']
        collect_data_list = []
        total_time = time.time()
        models_list = {
            'EducationalSystem': EducationalSystem,
            'Faculty': Faculty,
            'Major': Major,
            'AcademicYear': AcademicYear,
            'Class': Class,
            'Criterion': Criterion,
            'Semester': Semester,

            'Student': Student,
            'Assistant': Assistant,
            'Specialist': Specialist,

            'Bulletin': Bulletin,
            'Activity': Activity,
        }
        with transaction.atomic():
            for model_name, model_instance in models_list.items():
                if self.is_collected_data(app_labels=[model_instance._meta.app_label], model_names=[model_name.lower()]):
                    self.stdout.write(f'Data for {model_name} already exists {self.style.ERROR("SKIP")}')
                    continue

                model_data = self.process_json_file(MODEL_DATA_PATH[model_name])
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
                self.stdout.write(f'Created data for {model_name} successfully... {self.style.SUCCESS(f"OK")}')

            # SemesterOfStudent && TrainingPoint
            if self.is_collected_data(app_labels=[SemesterOfStudent._meta.app_label, TrainingPoint._meta.app_label], model_names=['semesterofstudent', 'trainingpoint']):
                self.stdout.write(f'Data for SemesterOfStudent already exists {self.style.ERROR("SKIP")}')
            else:
                semesters = Semester.objects.prefetch_related('students').all()
                students = Student.objects.all()
                self.create_semester_of_student(semesters=semesters, students=students)
                self.create_training_point_for_students(students=students, semesters=semesters, criterions=Criterion.objects.all())

                collect_data_list.append(CollectData(app_label=SemesterOfStudent._meta.app_label, model_name='semesterofstudent', applied=True))
                collect_data_list.append(CollectData(app_label=TrainingPoint._meta.app_label, model_name='trainingpoint', applied=True))
                self.stdout.write(f'Created data for SemesterOfStudent successfully... {self.style.SUCCESS(f"OK")}')
                self.stdout.write(f'Created data for TrainingPoint successfully... {self.style.SUCCESS(f"OK")}')

            # Account
            if self.is_collected_data(app_labels=[Account._meta.app_label], model_names=['account']):
                self.stdout.write(f'Data for Account already exists {self.style.ERROR("SKIP")}')
            else:
                faculties = Faculty.objects.prefetch_related('students', 'assistants', 'specialists').all()
                for faculty in faculties:
                    classes = Class.objects.filter(major__faculty=faculty)
                    for sclass in classes:
                        students = sclass.students.select_related('account').order_by('?')[:15]
                        self.create_accounts_for_users(users=students, password=self.default_password, role=Account.Role.STUDENT)

                    assistants = faculty.assistants.select_related('account').order_by('?')[:2]
                    specialists = faculty.specialists.select_related('account').all()
                    self.create_accounts_for_users(users=assistants, password=self.default_password, role=Account.Role.ASSISTANT)
                    self.create_accounts_for_users(users=specialists, password=self.default_password, role=Account.Role.SPECIALIST)

                collect_data_list.append(CollectData(app_label=Account._meta.app_label, model_name='account', applied=True))
                self.stdout.write(f'Created account for Student successfully... {self.style.SUCCESS(f"OK")}')
                self.stdout.write(f'Created account for Assistant of successfully... {self.style.SUCCESS(f"OK")}')
                self.stdout.write(f'Created account for Specialist of successfully... {self.style.SUCCESS(f"OK")}')

            # ActivityRegistration
            if self.is_collected_data(app_labels=[ActivityRegistration._meta.app_label], model_names=['activityregistration']):
                self.stdout.write(f'Data for ActivityRegistration already exists {self.style.ERROR("SKIP")}')
            else:
                activities = Activity.objects.prefetch_related('participants').all()
                classes = Class.objects.prefetch_related('students').all()
                self.create_activity_registrations(activities=activities, classes=classes)

                collect_data_list.append(CollectData(app_label=ActivityRegistration._meta.app_label, model_name='activityregistration', applied=True))
                self.stdout.write(f'Created data for ActivityRegistration successfully... {self.style.SUCCESS(f"OK")}')

            models_list = {
                'Comment': Comment,
                'Like': Like,
            }
            for model_name, model_instance in models_list.items():
                if self.is_collected_data(app_labels=[model_instance._meta.app_label], model_names=[model_name.lower()]):
                    self.stdout.write(f'Data for {model_name} already exists {self.style.ERROR("SKIP")}')
                    continue

                model_data = self.process_json_file(MODEL_DATA_PATH[model_name])
                start_time = time.time()
                for data in model_data:
                    obj = model_instance.objects.create(**data)

                collect_data_list.append(CollectData(app_label=model_instance._meta.app_label, model_name=model_name.lower(), applied=True))
                self.stdout.write(f'Created data for {model_name} successfully... {self.style.SUCCESS(f"OK")}')

            CollectData.objects.bulk_create(collect_data_list)
            self.stdout.write(f'- Total time: {self.style.SUCCESS(self.convert_seconds(time.time() - total_time))}')

    def create_semester_of_student(self, semesters, students):
        semester_of_student = [
            SemesterOfStudent(semester=semester, student=student)
            for semester in semesters
            for student in students
        ]
        SemesterOfStudent.objects.bulk_create(semester_of_student)

    def create_training_point_for_students(self, students, semesters, criterions):
        training_points = [
            TrainingPoint(student=student, semester=semester, criterion=criterion, point=random.randint(0, 80))
            for criterion in criterions
            for semester in semesters
            for student in students
        ]
        TrainingPoint.objects.bulk_create(training_points)

    def create_accounts_for_users(self, users, password, role):
        for user in users:
            first_name = re.escape(unidecode.unidecode(user.first_name).lower().replace(' ', ''))
            account_data = {'email': f'{user.code}{first_name}@ou.edu.vn', 'password': password, 'role': role, 'avatar': self.default_avatar}

            account = Account.objects.create(**account_data)
            user.account = account
            user.save()

            factory.set_permissions_for_account(account)

    def create_activity_registrations(self, activities, classes):
        activity_registrations = []
        for activity in activities:
            for sclass in classes:
                students = sclass.students.filter(account__isnull=False).order_by('?')[:10]
                for student in students:
                    activity_registrations.append(ActivityRegistration(activity=activity, student=student))

        ActivityRegistration.objects.bulk_create(activity_registrations)

    def is_collected_data(self, app_labels, model_names):
        return CollectData.objects.filter(app_label__in=app_labels, model_name__in=model_names, applied=True).exists()

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
            remaining_seconds = round(seconds % 60, 2)
            return f'{minutes}m {remaining_seconds}s'

        return f'{round(seconds, 2)}s'
