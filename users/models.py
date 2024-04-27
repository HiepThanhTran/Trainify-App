from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models

from users.managers import CustomUserManager


class User(AbstractUser):
    class Role(models.TextChoices):
        OFFICER = 'Chuyên viên cộng tác sinh viên'
        STUDENT_ASSISTANT = 'Trợ lý sinh viên'
        STUDENT = 'Sinh viên'
        ADMIN = 'Administrator'

    role = models.CharField(max_length=50, default=Role.STUDENT, choices=[(role.name, role.value) for role in Role])

    class Gender(models.TextChoices):
        MALE = 'Nam'
        FEMALE = 'Nữ'

    gender = models.CharField(max_length=10, null=True, blank=True, choices=[(gender.name, gender.value) for gender in Gender])

    avatar = CloudinaryField(null=True)
    first_name = models.CharField(max_length=150)
    middle_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=11, blank=True, unique=True)
    date_of_birth = models.DateField()
    address = models.CharField(max_length=255, blank=True, unique=True)

    faculty = models.ForeignKey('schools.Faculty', null=True, on_delete=models.SET_NULL)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'middle_name', 'last_name']

    def __str__(self):
        return self.username

    def get_full_name(self):
        full_name = "%s %s %s" % (self.last_name, self.middle_name, self.first_name)
        return full_name.strip()


class Officer(User):
    job_title = models.CharField(max_length=50)
    academic_degree = models.CharField(max_length=50)


class Student(User):
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
