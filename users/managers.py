import datetime

from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class AccountManager(BaseUserManager):
    def create_user(self, email=None, password=None, **extra_fields):
        if not email:
            raise ValueError(_('Email must be set'))

        email = self.normalize_email(email)
        account = self.model(email=email, **extra_fields)
        account.set_password(password)
        account.save()

        from users.models import Administrator
        administrator = Administrator.objects.create(first_name='Administrator', account=account, date_of_birth=datetime.date.today())

        from tpm.utils import factory
        factory.set_role(administrator)
        factory.set_permissions_for_account(account)

        return account

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email=email, password=password, **extra_fields)
