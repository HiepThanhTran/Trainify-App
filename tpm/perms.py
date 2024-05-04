from rest_framework import permissions

from users.models import Account


ROLES_ALLOWED_TO_CREATE_ACCOUNTS = [
    Account.Role.ADMIN,
    Account.Role.SPECIALIST,
    Account.Role.STUDENT,
]


class AllowedCreateAccount(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role in ROLES_ALLOWED_TO_CREATE_ACCOUNTS


class IsStudent(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == Account.Role.STUDENT


class HasInActivitiesGroup(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.has_in_activities_group()


class AllowedEditComment(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, comment):
        return super().has_permission(request, view) and request.user == comment.account
