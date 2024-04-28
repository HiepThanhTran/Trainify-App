# from django.contrib import admin

from tpm.admin import my_admin_site
from .models import *

my_admin_site.register(EducationalSystem)
my_admin_site.register(Faculty)
my_admin_site.register(Major)
my_admin_site.register(AcademicYear)
my_admin_site.register(Class)
my_admin_site.register(Semester)
my_admin_site.register(Criterion)
my_admin_site.register(TrainingPoint)
my_admin_site.register(DeficiencyReport)
