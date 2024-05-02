from django.db import models
from django.template.defaultfilters import slugify
from django.utils.translation import gettext_lazy as _
from django_ckeditor_5.fields import CKEditor5Field

from tpm.models import BaseModel


class ExtracurricularActivity(BaseModel):
    class Meta:
        verbose_name = _('Extracurricular Activities')
        verbose_name_plural = _('List of extracurricular activities (EA)')

    class OrganizationalType(models.TextChoices):
        ONLINE = 'Onl', _('Online')
        OFFLINE = 'Off', _('Offline')

    # Hình thức tổ chức
    organizational_form = models.CharField(max_length=3, choices=OrganizationalType, default=OrganizationalType.OFFLINE)

    name = models.CharField(max_length=20)
    participant = models.CharField(max_length=20)  # Đối tượng tham gia
    start_date = models.DateField()
    end_date = models.DateField()
    location = models.CharField(max_length=255)
    point = models.SmallIntegerField()  # Điểm được cộng
    description = CKEditor5Field('Text', config_name='extends')
    slug = models.SlugField(max_length=50, unique=True, editable=False)

    # Danh sách sinh viên tham gia
    list_of_participants = models.ManyToManyField('users.Student', related_name='activities', through='StudentActivityParticipation')

    # Thuộc khoa nào?
    faculty = models.ForeignKey('schools.Faculty', on_delete=models.CASCADE, related_name='activities')
    # Thuộc học kỳ nào?
    semester = models.ForeignKey('schools.Semester', on_delete=models.CASCADE, related_name='activities')
    # Người tạo là ai?
    created_by = models.ForeignKey('users.Officer', null=True, on_delete=models.SET_NULL, related_name='activities')
    # Cộng điểm rèn luyện điều mấy?
    criterion = models.ForeignKey('schools.Criterion', null=True, on_delete=models.SET_NULL, related_name='activities')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.id:
            self.slug = slugify(self.name)

        return super().save(*args, **kwargs)


class StudentActivityParticipation(BaseModel):
    class Meta:
        verbose_name = _('EA registration form')
        verbose_name_plural = _('List of student EA registration forms')
        unique_together = ('student', 'activity')  # Sinh viên chỉ đăng ký tham gia hoạt động một lần

    is_joined = models.BooleanField(default=False)
    is_point_added = models.BooleanField(default=False)

    activity = models.ForeignKey(ExtracurricularActivity, on_delete=models.CASCADE, related_name='participants')
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE, related_name='participated_activities')

    def __str__(self):
        return f"{self.student.student_code} - {self.activity.name}"