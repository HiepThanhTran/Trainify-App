from rest_framework import permissions


class HasActivitiesGroupPermission(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.has_in_activities_group()
