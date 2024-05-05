from django.db import models
from django.utils.translation import gettext_lazy as _
from django_ckeditor_5.fields import CKEditor5Field

from tpm.models import BaseModel


class EducationalSystem(BaseModel):
    class Meta:
        verbose_name = _("Educational System")
        verbose_name_plural = _("Educational Systems")

    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class Faculty(BaseModel):
    class Meta:
        verbose_name = _("Faculty")
        verbose_name_plural = _("Faculties")

    name = models.CharField(max_length=30)

    educational_system = models.ForeignKey(EducationalSystem, on_delete=models.CASCADE, related_name="faculties")

    def __str__(self):
        return self.name


class Major(BaseModel):
    class Meta:
        verbose_name = _("Major")
        verbose_name_plural = _("Majors")

    name = models.CharField(max_length=30)

    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name="majors")

    def __str__(self):
        return self.name


class AcademicYear(BaseModel):
    class Meta:
        verbose_name = _("Academic Year")
        verbose_name_plural = _("Academic Years")

    name = models.CharField(max_length=20)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.name


class Class(BaseModel):
    class Meta:
        verbose_name = _("Class")
        verbose_name_plural = _("Classes")

    name = models.CharField(max_length=20)

    major = models.ForeignKey(Major, on_delete=models.CASCADE, related_name="classes")
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name="classes")

    def __str__(self):
        return self.name


class Semester(BaseModel):
    class Meta:
        verbose_name = _("Semester")
        verbose_name_plural = _("Semesters")

    name = models.CharField(max_length=10)
    start_date = models.DateField()
    end_date = models.DateField()

    students = models.ManyToManyField("users.Student", related_name="semesters", through="SemesterOfStudent")

    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name="semesters")

    def __str__(self):
        return f"{self.name} - {self.academic_year.name}"


class SemesterOfStudent(BaseModel):
    class Meta:
        verbose_name = _("Semester Of Student")
        verbose_name_plural = _("Semester Of Student")
        unique_together = ("semester", "student")

    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    student = models.ForeignKey("users.Student", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.semester.name}"


class Criterion(BaseModel):
    class Meta:
        verbose_name = _("Criterion")
        verbose_name_plural = _("Criterions")

    name = models.CharField(max_length=20)
    max_point = models.SmallIntegerField()
    description = CKEditor5Field("Text", config_name="extends")

    def __str__(self):
        return self.name


class TrainingPoint(BaseModel):
    class Meta:
        verbose_name = _("Training Point")
        verbose_name_plural = _("Training Points")

    point = models.SmallIntegerField(default=0)

    # Thuộc học kỳ nào?
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name="points")
    # Thuộc tiêu chí rèn luyện nào?
    criterion = models.ForeignKey(Criterion, on_delete=models.CASCADE, related_name="points")
    # Của sinh viên nào?
    student = models.ForeignKey("users.Student", on_delete=models.CASCADE, related_name="points")

    def __str__(self):
        return f"{self.student.student_code} - {self.point} - {self.criterion} - {self.semester}"
