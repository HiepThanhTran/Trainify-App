from rest_framework import permissions

from users.models import Account


class IsRole(permissions.IsAuthenticated):
    role = None

    def has_permission(self, request, view):
        return super().has_permission(request, view) and (request.user.role == self.role or getattr(request.user, self.role.lower()))


class IsAdministrator(IsRole):
    role = Account.Role.ADMINISTRATOR


class IsSpecialist(IsRole):
    role = Account.Role.SPECIALIST


class IsAssistant(IsRole):
    role = Account.Role.ASSISTANT


class IsStudent(IsRole):
    role = Account.Role.STUDENT


class HasInActivitiesGroup(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.has_in_activities_group()


class AllowedEditComment(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, comment):
        return super().has_permission(request, view) and request.user == comment.account
