from cloudinary.models import CloudinaryField
from django.db import models
from django_ckeditor_5.fields import CKEditor5Field

from interacts.models import BaseModel


class EducationalSystem(BaseModel):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class Faculty(BaseModel):
    name = models.CharField(max_length=30)

    training_program = models.ForeignKey(EducationalSystem, on_delete=models.CASCADE, related_name='faculties')

    def __str__(self):
        return self.name


class Major(BaseModel):
    name = models.CharField(max_length=30)

    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='majors')

    def __str__(self):
        return self.name


class AcademicYear(BaseModel):
    academic_year = models.CharField(max_length=20)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.name


class Class(BaseModel):
    name = models.CharField(max_length=20)

    major = models.ForeignKey(Major, on_delete=models.CASCADE, related_name='classes')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name='classes')

    def __str__(self):
        return self.name


class Semester(BaseModel):
    name = models.CharField(max_length=10)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.name


class Criterion(BaseModel):
    name = models.CharField(max_length=20)
    max_point = models.SmallIntegerField()
    description = CKEditor5Field('Text', config_name='extends')

    def __str__(self):
        return self.name


class TrainingPoint(BaseModel):
    point = models.SmallIntegerField()

    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='points')
    criterion = models.ForeignKey(Criterion, on_delete=models.CASCADE, related_name='points')
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE, related_name='points')

    def __str__(self):
        return self.criterion.name


class DeficiencyReport(BaseModel):
    class Meta:
        unique_together = ('student', 'activity')

    is_resolved = models.BooleanField(default=False)
    image = CloudinaryField(null=True)
    content = CKEditor5Field('Text', config_name='extends', null=True, blank=True)

    student = models.ForeignKey('users.Student', on_delete=models.CASCADE, related_name='deficiency_reports')
    activity = models.ForeignKey('activities.ExtracurricularActivity', on_delete=models.CASCADE, related_name='deficiency_reports')

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.activity.name}"
