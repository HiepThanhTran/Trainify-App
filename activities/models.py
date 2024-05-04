from cloudinary.models import CloudinaryField
from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_ckeditor_5.fields import CKEditor5Field

from tpm.models import BaseModel


class Activity(BaseModel):
    class Meta:
        verbose_name = _("Activity")
        verbose_name_plural = _("Activities")

    class Type(models.TextChoices):
        ONLINE = "Onl", _("Online")
        OFFLINE = "Off", _("Offline")

    # Hình thức tổ chức
    organizational_form = models.CharField(max_length=3, choices=Type, default=Type.OFFLINE)

    name = models.CharField(max_length=20)
    participant = models.CharField(max_length=20)  # Đối tượng tham gia
    start_date = models.DateField()
    end_date = models.DateField()
    location = models.CharField(max_length=255)
    point = models.SmallIntegerField()  # Điểm được cộng
    description = CKEditor5Field("Text", config_name="extends")

    # Danh sách sinh viên tham gia
    list_of_participants = models.ManyToManyField("users.Student", related_name="activities", through="Participation")

    # Thuộc khoa nào?
    faculty = models.ForeignKey("schools.Faculty", on_delete=models.CASCADE, related_name="activities")
    # Thuộc học kỳ nào?
    semester = models.ForeignKey("schools.Semester", on_delete=models.CASCADE, related_name="activities")
    # Người tạo là ai?
    created_by_type = models.ForeignKey("contenttypes.ContentType", on_delete=models.CASCADE, related_name="activities")
    created_by_id = models.PositiveIntegerField()
    created_by = GenericForeignKey("created_by_type", "created_by_id")
    # Cộng điểm rèn luyện điều mấy?
    criterion = models.ForeignKey("schools.Criterion", null=True, on_delete=models.SET_NULL, related_name="activities")

    def __str__(self):
        return self.name


class Participation(BaseModel):
    class Meta:
        verbose_name = _("participation")
        verbose_name_plural = _("participations")
        unique_together = ("student", "activity")  # Sinh viên chỉ đăng ký tham gia hoạt động một lần

    is_attendance = models.BooleanField(default=False)
    is_point_added = models.BooleanField(default=False)

    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name="participations")
    student = models.ForeignKey("users.Student", on_delete=models.CASCADE, related_name="participations")

    def __str__(self):
        return f"{self.student.code} - {self.activity}"


class DeficiencyReport(BaseModel):
    class Meta:
        verbose_name = _("Deficiency Report")
        verbose_name_plural = _("Deficiency Reports")
        unique_together = ("student", "activity")  # Sinh viên chỉ báo thiếu một lần cho một hoạt động

    is_resolved = models.BooleanField(default=False)  # Đã giải quyết chưa?
    image = CloudinaryField(null=True, blank=True)  # Hình ảnh minh chứng
    content = CKEditor5Field("Text", config_name="extends", null=True, blank=True)

    # Của sinh viên nào?
    student = models.ForeignKey("users.Student", on_delete=models.CASCADE, related_name="deficiency_reports")
    # Thuộc hoạt động nào?
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name="deficiency_reports")

    def __str__(self):
        return f"{self.student.code} - {self.activity}"
