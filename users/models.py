from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.template.defaultfilters import slugify
from django.utils.translation import gettext_lazy as _

from tpm.models import BaseModel


class Account(AbstractUser):
    class Meta:
        verbose_name = _("account")
        verbose_name_plural = _("accounts")

    class Role(models.TextChoices):
        ADMIN = "AD", _("Administrator")
        STUDENT = "STU", _("Sinh viên")
        ASSISTANT = "ASST", _("Trợ lý sinh viên")
        SPECIALIST = "SPC", _("Chuyên viên cộng tác sinh viên")

    role = models.CharField(max_length=4, choices=Role, default=Role.STUDENT)

    email = models.EmailField(unique=True)
    avatar = CloudinaryField(null=True, blank=True)
    slug = models.SlugField(max_length=150, unique=True, editable=False)

    first_name = None
    last_name = None

    from users.managers import CustomUserManager
    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self.id:
            self.slug = slugify(self.username)

        return super().save(*args, **kwargs)


class User(BaseModel):
    class Meta:
        abstract = True

    class Gender(models.TextChoices):
        MALE = "M", _("Nam")
        FEMALE = "F", _("Nữ")
        UNKNOWN = "U", _("Khác")

    gender = models.CharField(max_length=1, choices=Gender, default=Gender.UNKNOWN)

    first_name = models.CharField(max_length=50, blank=True)  # Tên
    middle_name = models.CharField(max_length=50, blank=True)  # Tên đệm
    last_name = models.CharField(max_length=50, blank=True)  # Họ
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=11, null=True, unique=True)
    code = models.CharField(max_length=10, null=True, unique=True, db_index=True, editable=False)

    account = models.OneToOneField(Account, null=True, on_delete=models.SET_NULL)

    faculty = models.ForeignKey("schools.Faculty", null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.code} - {self.get_full_name()}" if self.code else self.get_full_name()

    def generate_code(self):
        return self.code

    def get_full_name(self):
        return f"{self.last_name} {self.middle_name} {self.first_name}"


class Officer(User):
    class Meta:
        verbose_name = _("officer")
        verbose_name_plural = _("officers")

    job_title = models.CharField(max_length=50, null=True, blank=True)
    academic_degree = models.CharField(max_length=50, null=True, blank=True)

    def generate_code(self):
        if self.faculty:
            return f"{self.account.role}-{self.faculty.id:02d}{self.id:03d}"

        return f"{self.account.role}-{self.id:03d}"


class Student(User):
    class Meta:
        verbose_name = _("student")
        verbose_name_plural = _("students")

    major = models.ForeignKey("schools.Major", null=True, on_delete=models.SET_NULL, related_name="students")
    class_name = models.ForeignKey("schools.Class", null=True, on_delete=models.SET_NULL, related_name="students")
    academic_year = models.ForeignKey("schools.AcademicYear", null=True, on_delete=models.SET_NULL, related_name="students")
    educational_system = models.ForeignKey("schools.EducationalSystem", null=True, on_delete=models.SET_NULL, related_name="students")

    def generate_code(self):
        return f"{self.academic_year.start_date.year[-2:]:02d}{self.faculty.id:02d}{self.id:06d}"
