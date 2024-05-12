import os

from django.db import migrations

from core import settings
from core.utils import factory

DATA_PATH = {
    'EducationalSystem': os.path.join(settings.STATIC_ROOT, 'data/schools/educational_system_data.json'),
    'Faculty': os.path.join(settings.STATIC_ROOT, 'data/schools/faculty_data.json'),
    'Major': os.path.join(settings.STATIC_ROOT, 'data/schools/major_data.json'),
    'AcademicYear': os.path.join(settings.STATIC_ROOT, 'data/schools/academic_year_data.json'),
    'Class': os.path.join(settings.STATIC_ROOT, 'data/schools/class_data.json'),
    'Semester': os.path.join(settings.STATIC_ROOT, 'data/schools/semester_data.json'),
    'Criterion': os.path.join(settings.STATIC_ROOT, 'data/schools/criterion_data.json'),
}


def insert_data(apps, schema_editor):
    EducationalSystem = apps.get_model('schools', 'EducationalSystem')
    Faculty = apps.get_model('schools', 'Faculty')
    Major = apps.get_model('schools', 'Major')
    AcademicYear = apps.get_model('schools', 'AcademicYear')
    Class = apps.get_model('schools', 'Class')
    Semester = apps.get_model('schools', 'Semester')
    Criterion = apps.get_model('schools', 'Criterion')
    models = {
        'EducationalSystem': EducationalSystem,
        'Faculty': Faculty,
        'Major': Major,
        'AcademicYear': AcademicYear,
        'Class': Class,
        'Semester': Semester,
        'Criterion': Criterion,
    }
    for key, value in models.items():
        model_data = factory.process_json_file(DATA_PATH[key])
        for data in model_data:
            instance = value(**data)
            instance.save()


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('schools', '0002_initial'),
    ]

    operations = [
        migrations.RunPython(insert_data),
    ]
