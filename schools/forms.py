from django import forms
from django.contrib.contenttypes.models import ContentType


class ActivityAdminForm(forms.ModelForm):
    created_by_id = forms.ChoiceField(label="Created by", choices=[])

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        user_content_types = ContentType.objects.filter(app_label="users", model__in=["administrator", "assistant", "specialist"])

        user_instances = []
        for user_content_type in user_content_types:
            user_instances.extend(user_content_type.model_class().objects.all())

        choices = [(instance.id, f"{instance.id} - {instance.get_full_name()}") for instance in user_instances]

        self.fields["created_by_id"].choices = choices
