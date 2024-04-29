# from django.contrib import admin
from schools.models import EducationalSystem, Faculty, Major, AcademicYear, Class, Semester, Criterion, TrainingPoint, Activity, StudentActivity, DeficiencyReport
from tpm.admin import my_admin_site

my_admin_site.register(EducationalSystem)
my_admin_site.register(Faculty)
my_admin_site.register(Major)
my_admin_site.register(AcademicYear)
my_admin_site.register(Class)
my_admin_site.register(Semester)
my_admin_site.register(Criterion)
my_admin_site.register(TrainingPoint)
my_admin_site.register(Activity)
my_admin_site.register(StudentActivity)
my_admin_site.register(DeficiencyReport)
