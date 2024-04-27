from cloudinary.models import CloudinaryField
from django.db import models
from django_ckeditor_5.fields import CKEditor5Field

from interacts.models import BaseModel


class News(BaseModel):
    title = models.CharField(max_length=20)
    image = CloudinaryField(null=True, blank=True)
    content = CKEditor5Field('Text', config_name='extends')

    created_by = models.ForeignKey('users.Officer', null=True, on_delete=models.SET_NULL, related_name='news')

    def __str__(self):
        return self.title


class ExtracurricularActivity(BaseModel):
    class OrganizationalForm(models.TextChoices):
        ONLINE = 'Online'
        OFFLINE = 'Offline'

    # Hình thức tổ chức
    organizational_form = models.CharField(max_length=20, choices=[(form.name, form.value) for form in OrganizationalForm])

    name = models.CharField(max_length=20)
    participant = models.CharField(max_length=20)  # Đối tượng tham gia
    start_date = models.DateField()
    end_date = models.DateField()
    location = models.CharField(max_length=255)
    point = models.SmallIntegerField()  # Điểm được cộng
    description = CKEditor5Field('Text', config_name='extends')

    # Danh sách sinh viên tham gia
    list_of_participants = models.ManyToManyField('users.Student', related_name='activities', through='StudentActivityParticipation')

    # Thuộc bản tin nào?
    news = models.ForeignKey(News, null=True, on_delete=models.SET_NULL, related_name='activities')
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


class StudentActivityParticipation(BaseModel):
    class Meta:
        unique_together = ('student', 'activity')

    is_joined = models.BooleanField(default=False)
    is_point_added = models.BooleanField(default=False)

    activity = models.ForeignKey(ExtracurricularActivity, on_delete=models.CASCADE, related_name='participants')
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE, related_name='participated_activities')

    def __str__(self):
        return f"{self.student.student_code} - {self.activity.name}"
