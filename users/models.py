from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser, Permission, Group
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.utils.translation import gettext_lazy as _

from activities.models import Activity
from tpm.models import BaseModel


class Account(AbstractUser):
    class Meta:
        verbose_name = _("Account")
        verbose_name_plural = _("Accounts")

    class Role(models.TextChoices):
        ADMINISTRATOR = "AD", _("Administrator")
        STUDENT = "STU", _("Sinh viên")
        ASSISTANT = "ASST", _("Trợ lý sinh viên")
        SPECIALIST = "SPC", _("Chuyên viên cộng tác sinh viên")

    role = models.CharField(max_length=4, choices=Role, null=True)

    email = models.EmailField(unique=True)
    avatar = CloudinaryField(null=True, blank=True)
    username = models.CharField(max_length=150, null=True, unique=True)

    first_name = None
    last_name = None

    from users.managers import AccountManager
    objects = AccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)

    @property
    def has_in_activities_group(self):
        return self.groups.filter(name="activities").exists()


class User(BaseModel):
    class Meta:
        abstract = True

    class Gender(models.TextChoices):
        MALE = "M", _("Nam")
        FEMALE = "F", _("Nữ")
        UNKNOWN = "U", _("Khác")

    gender = models.CharField(max_length=1, choices=Gender, default=Gender.UNKNOWN)

    first_name = models.CharField(max_length=50)  # Tên
    middle_name = models.CharField(max_length=50)  # Tên đệm
    last_name = models.CharField(max_length=50)  # Họ
    date_of_birth = models.DateField()
    address = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=11, null=True, unique=True)

    account = models.OneToOneField(Account, null=True, blank=True, on_delete=models.SET_NULL)

    faculty = models.ForeignKey("schools.Faculty", null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.id} - {self.get_full_name()}"

    def get_full_name(self):
        return f"{self.last_name} {self.middle_name} {self.first_name}"


class Officer(User):
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if not self.account.has_in_activities_group():
            group, created = Group.objects.get_or_create(name="activities")

            if created:
                content_type = ContentType.objects.get_for_model(Activity)
                all_permissions_activity = Permission.objects.filter(content_type=content_type)
                group.permissions.set(all_permissions_activity)

            self.account.groups.add(group)


class Administrator(Officer):
    class Meta:
        verbose_name = _("Administrator")
        verbose_name_plural = _("Administrators")

    activities = GenericRelation(
        Activity,
        related_name='administrators',
        related_query_name='administrators',
        content_type_field="created_by_type",
        object_id_field="created_by_id"
    )


class Specialist(Officer):
    class Meta:
        verbose_name = _("Specialist")
        verbose_name_plural = _("Specialists")

    job_title = models.CharField(max_length=50, null=True, blank=True)
    academic_degree = models.CharField(max_length=50, null=True, blank=True)

    activities = GenericRelation(
        Activity,
        related_name='specialists',
        related_query_name='specialists',
        content_type_field="created_by_type",
        object_id_field="created_by_id"
    )


class Assistant(Officer):
    class Meta:
        verbose_name = _("Assistant")
        verbose_name_plural = _("Assistants")

    activities = GenericRelation(
        Activity,
        related_name='assistants',
        related_query_name='assistants',
        content_type_field="created_by_type",
        object_id_field="created_by_id"
    )


class Student(User):
    class Meta:
        verbose_name = _("Student")
        verbose_name_plural = _("Students")

    student_code = models.CharField(max_length=10, null=True, blank=True, unique=True, db_index=True, editable=False)

    major = models.ForeignKey("schools.Major", null=True, on_delete=models.SET_NULL, related_name="students")
    class_name = models.ForeignKey("schools.Class", null=True, on_delete=models.SET_NULL, related_name="students")
    academic_year = models.ForeignKey("schools.AcademicYear", null=True, on_delete=models.SET_NULL, related_name="students")
    educational_system = models.ForeignKey("schools.EducationalSystem", null=True, on_delete=models.SET_NULL, related_name="students")

    def __str__(self):
        return f"{self.student_code} - {self.get_full_name()}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.student_code is None:
            self.student_code = self.generate_code()
            self.save()

    def generate_code(self):
        return f"{str(self.academic_year.start_date.year)[-2:]}{self.faculty.id:02d}{self.id:06d}"
