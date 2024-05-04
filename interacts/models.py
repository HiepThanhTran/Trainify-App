from django.db import models
from django_ckeditor_5.fields import CKEditor5Field

from tpm.models import BaseModel


class Interaction(BaseModel):
    class Meta:
        abstract = True

    account = models.ForeignKey("users.Account", on_delete=models.CASCADE)
    activity = models.ForeignKey("activities.Activity", on_delete=models.CASCADE)


class Comment(Interaction):
    content = CKEditor5Field("Text", config_name="extends")


class Like(Interaction):
    class Meta:
        unique_together = ("account", "activity")
