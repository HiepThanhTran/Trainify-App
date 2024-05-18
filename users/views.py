from rest_framework import generics, parsers, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from activities import serializers as activities_serializers
from core.utils import paginators, perms
from core.utils.dao import dao
from core.utils.factory import factory
from schools.models import Semester
from users import serializers as users_serializers
from users.models import Account, Assistant, Student


class AccountViewSet(viewsets.ViewSet):
    queryset = Account.objects.filter(is_active=True)
    serializer_class = users_serializers.AccountSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ["get_authenticated_account", "partial_update_authenticated_account"]:
            return [permissions.IsAuthenticated()]

        if self.action in ["create_assistant_account"]:
            return [perms.HasInSpeacialistGroup()]

        return [permissions.AllowAny()]

    @action(methods=["get"], detail=False, url_path="me")
    def get_authenticated_account(self, request):
        serializer = self.serializer_class(request.user)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(methods=["patch"], detail=False, url_path="me/update")
    def partial_update_authenticated_account(self, request):
        serializer = users_serializers.AccountUpdateSerializer(instance=request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(data=self.serializer_class(request.user).data, status=status.HTTP_200_OK)

    @action(methods=["get"], detail=False, url_path="roles")
    def get_roles(self, request):
        roles = dict(Account.Role.choices)
        return Response(data=roles, status=status.HTTP_200_OK)

    @action(methods=["post"], detail=False, url_path="auth/students/register")
    def create_student_account(self, request):
        return self._create_account(request=request)

    @action(methods=["post"], detail=False, url_path="auth/assistants/register")
    def create_assistant_account(self, request):
        return self._create_account(request=request)

    def _create_account(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(data=serializer.data, status=status.HTTP_201_CREATED)


class AssistantViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Assistant.objects.select_related("faculty").filter(is_active=True)
    serializer_class = users_serializers.AssistantSerializer
    permission_classes = [perms.HasInSpeacialistGroup]


class StudentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Student.objects.select_related("faculty", "major", "sclass", "academic_year", "educational_system").filter(is_active=True)
    serializer_class = users_serializers.StudentSerializer
    pagination_class = paginators.StudentPagination

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__("get_activities"):
            return queryset.prefetch_related("registrations")

        if self.action.__eq__("get_points"):
            return queryset.prefetch_related("points")

        return queryset

    def get_permissions(self):
        if self.action in ["get_activities", "get_points"]:
            return [perms.HasInStudentGroup()]

        return [perms.HasInAssistantGroup()]

    @action(methods=["get"], detail=True, url_path="activities")
    def get_activities(self, request, pk=None):
        partd = request.query_params.get("partd")

        registrations = self.get_object().registrations.select_related("activity").filter(is_active=True)
        registrations = registrations.filter(is_attendance=partd) if partd and (partd.__eq__("True") or partd.__eq__("False")) else registrations
        activities = [registration.activity for registration in registrations]

        return factory.get_paginators_response(
            paginator=paginators.ActivityPagination(), request=request,
            serializer_class=activities_serializers.ActivitySerializer, data=activities
        )

    @action(methods=["get"], detail=True, url_path="points/(?P<semester_code>[^/.]+)")
    def get_points(self, request, pk=None, semester_code=None):
        semester = get_object_or_404(queryset=Semester, code=semester_code)
        student_summary, training_points = dao.statistics_student(semester=semester, student=self.get_object())

        criterion_name = request.query_params.get("criterion")
        if criterion_name:
            training_points = training_points.filter(criterion__icontains=criterion_name)
            student_summary["training_points"] = training_points

        return Response(data=student_summary, status=status.HTTP_200_OK)
