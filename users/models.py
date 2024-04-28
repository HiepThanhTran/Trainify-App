from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from tpm.models import BaseModel
from users.managers import CustomUserManager


class Account(AbstractUser):
    class Meta:
        verbose_name = _('account')
        verbose_name_plural = _('accounts')

    class Role(models.IntegerChoices):
        ADMIN = 1, _('Administrator')
        STUDENT = 2, _('Sinh viên')
        ASSISTANT = 3, _('Trợ lý sinh viên')
        SPECIALIST = 4, _('Chuyên viên cộng tác sinh viên')

    role = models.IntegerField(choices=Role, default=Role.STUDENT)

    email = models.EmailField(unique=True)
    avatar = CloudinaryField(null=True, blank=True)

    first_name = None
    last_name = None

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username


class User(BaseModel):
    class Meta:
        abstract = True

    class Gender(models.TextChoices):
        MALE = 'M', _('Nam')
        FEMALE = 'F', _('Nữ')
        UNKNOWN = 'U', _('Khác')

    gender = models.CharField(max_length=1, choices=Gender, default=Gender.UNKNOWN)

    first_name = models.CharField(max_length=50, blank=True)  # Tên
    middle_name = models.CharField(max_length=50, blank=True)  # Tên đệm
    last_name = models.CharField(max_length=50, blank=True)  # Họ
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=11, blank=True, unique=True)

    account = models.OneToOneField(Account, on_delete=models.CASCADE)

    faculty = models.ForeignKey('schools.Faculty', null=True, on_delete=models.SET_NULL)


class Officer(User):
    class Meta:
        verbose_name = _('officer')
        verbose_name_plural = _('officers')

    job_title = models.CharField(max_length=50)
    academic_degree = models.CharField(max_length=50)


class Student(User):
    class Meta:
        verbose_name = _('student')
        verbose_name_plural = _('students')

    student_code = models.CharField(max_length=10, null=True, unique=True)

    major = models.ForeignKey('schools.Major', null=True, on_delete=models.SET_NULL, related_name='students')
    class_name = models.ForeignKey('schools.Class', null=True, on_delete=models.SET_NULL, related_name='students')
    academic_year = models.ForeignKey('schools.AcademicYear', null=True, on_delete=models.SET_NULL, related_name='students')
    educational_system = models.ForeignKey('schools.EducationalSystem', null=True, on_delete=models.SET_NULL, related_name='students')

    def __str__(self):
        return f"{self.student_code} - {super().__str__()}"

    def save(self, *args, **kwargs):
        if not self.student_code:
            self.student_code = self.generate_student_code()

        return super().save(*args, **kwargs)

    def generate_student_code(self):
        academic_year = str(self.academic_year.start_date.year)[-2:]
        faculty_code = self.faculty.id

        return f"{academic_year:02d}{faculty_code:02d}{self.id:06d}"
