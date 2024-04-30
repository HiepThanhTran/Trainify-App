from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not email:
            raise ValueError(_('Email must be set'))

        if not username:
            raise ValueError(_('Username must be set'))

        email = self.normalize_email(email)
        account = self.model(email=email, username=username, **extra_fields)
        account.set_password(password)
        account.save()

        from users.models import Administrator
        administrator = Administrator(first_name='Administrator', account=account)
        administrator.save()

        return account

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        from users.models import Account
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', Account.Role.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True'))

        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True'))

        if extra_fields.get('role') is not Account.Role.ADMIN:
            raise ValueError(_('Superuser must have ADMIN role'))

        return self.create_user(email=email, username=username, password=password, **extra_fields)
