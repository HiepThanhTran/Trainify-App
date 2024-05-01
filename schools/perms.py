from rest_framework import permissions


class IsStudent(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'student')
