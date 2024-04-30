from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        from django.db.models.signals import post_save

        from users import signals
        from users.models import Administrator, Specialist, Assistant, Student

        post_save.connect(signals.generate_code, sender=Administrator)
        post_save.connect(signals.generate_code, sender=Specialist)
        post_save.connect(signals.generate_code, sender=Assistant)
        post_save.connect(signals.generate_code, sender=Student)
