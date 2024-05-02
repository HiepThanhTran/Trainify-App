from rest_framework import viewsets, permissions, generics, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response

from schools import perms as schools_perms, serializers as schools_serializers
from users import perms as users_perms, serializers as users_serializers
from users.models import Account, Student, Assistant, Specialist


class AccountViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = Account.objects.filter(is_active=True)
    serializer_class = users_serializers.AccountSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ["current_account"]:
            return [permissions.IsAuthenticated()]

        if self.action in ["create"]:
            return [users_perms.AllowedCreateAccount()]

        return [permissions.IsAdminUser()]

    @action(methods=["get"], detail=False, url_path="current-account")
    def current_account(self, request):
        return Response(data=users_serializers.AccountSerializer(request.user).data, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    pass


class SpecialistViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Specialist.objects.filter(is_active=True)
    serializer_class = users_serializers.SpecialistSerializer
    permission_classes = [schools_perms.HasActivitiesGroupPermission]


class AssistantViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Assistant.objects.filter(is_active=True)
    serializer_class = users_serializers.AssistantSerializer
    permission_classes = [schools_perms.HasActivitiesGroupPermission]


class StudentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Student.objects.filter(is_active=True)
    serializer_class = users_serializers.StudentSerializer

    def get_permissions(self):
        if self.action in ["current_student", "activities_participated", "activities"]:
            return [users_perms.IsStudent()]

        return [schools_perms.HasActivitiesGroupPermission()]

    @action(methods=["get"], detail=False, url_path="current-student")
    def current_student(self, request):
        return Response(data=users_serializers.StudentSerializer(request.user.student).data, status=status.HTTP_200_OK)

    @action(methods=["get"], detail=True, url_path="activities")
    def activities(self, request, pk=None):
        participations = self.get_object().participations.prefetch_related("activity").filter(is_active=True)

        query = self.request.query_params.get('filter', None)
        if query:
            if query.lower() == "participated":
                participations = participations.filter(is_attendance=True)
            elif query.lower() == "registered":
                participations = participations.filter(is_attendance=False)

        activities = [participation.activity for participation in participations]

        return Response(data=schools_serializers.ActivitySerializer(activities, many=True).data, status=status.HTTP_200_OK)
