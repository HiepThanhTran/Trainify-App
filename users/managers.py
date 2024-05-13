from django.contrib.auth.base_user import BaseUserManager
from django.db import transaction
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class AccountManager(BaseUserManager):
    def create_user(self, email=None, password=None, **extra_fields):
        from core.utils import factory
        if not email:
            raise ValueError(_('Email must be set'))

        with transaction.atomic():
            account, created = self.get_or_create(email=self.normalize_email(email), **extra_fields)

            if not created:
                return account

            account.set_password(password)
            account.avatar = factory.get_image()
            account.save(using=self._db)

            from users.models import Administrator
            administrator = Administrator.objects.create(
                account=account,
                first_name=f'Administrator {account.id}',
                date_of_birth=timezone.now(),
            )

            factory.set_role(administrator)
            factory.set_permissions_for_account(account)

        return account

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email=email, password=password, **extra_fields)
