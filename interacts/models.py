from django.db import models
from django_ckeditor_5.fields import CKEditor5Field


class BaseModel(models.Model):
    class Meta:
        abstract = True

    is_active = models.BooleanField(default=True)
    updated_date = models.DateTimeField(auto_now=True)
    created_date = models.DateTimeField(auto_now_add=True)


class Interaction(BaseModel):
    class Meta:
        abstract = True

    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    activity = models.ForeignKey('activities.ExtracurricularActivity', on_delete=models.CASCADE)


class Comment(Interaction):
    content = CKEditor5Field('Text', config_name='extends')


class Like(Interaction):
    class Meta:
        unique_together = ('user', 'activity')
