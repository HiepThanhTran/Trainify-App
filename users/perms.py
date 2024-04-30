from rest_framework import permissions

from users.models import Account

ACCOUNT_ROLE_ALLOW_CREATED = [
    Account.Role.ADMIN,
    Account.Role.SPECIALIST,
    Account.Role.STUDENT,
]


class AllowedCreateAccount(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role in ACCOUNT_ROLE_ALLOW_CREATED
