from rest_framework import viewsets, permissions, generics, status, parsers
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from activities import serializers as activities_serializers
from core.utils import perms, paginators
from core.utils.dao import dao
from core.utils.factory import factory
from schools import serializers as schools_serializers
from schools.models import Semester
from users import serializers as users_serializers
from users.models import Account, Student, Assistant


class AccountViewSet(viewsets.ViewSet):
    queryset = Account.objects.filter(is_active=True)
    serializer_class = users_serializers.AccountSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ['get_authenticated_account', 'update_authenticated_account']:
            return [permissions.IsAuthenticated()]

        if self.action in ['create_assistant_account']:
            return [perms.HasInSpeacialistGroup()]

        return [permissions.AllowAny()]

    @action(methods=['get'], detail=False, url_path='me')
    def get_authenticated_account(self, request):
        serializer = self.serializer_class(request.user)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(methods=['patch'], detail=False, url_path='me/update')
    def update_authenticated_account(self, request):
        serializer = users_serializers.AccountUpdateSerializer(instance=request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(data=self.serializer_class(request.user).data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=False, url_path='auth/students/register')
    def create_student_account(self, request):
        return self._create_account(request=request)

    @action(methods=['post'], detail=False, url_path='auth/assistants/register')
    def create_assistant_account(self, request):
        return self._create_account(request=request)

    def _create_account(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(data=serializer.data, status=status.HTTP_201_CREATED)


class AssistantViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Assistant.objects.select_related('faculty').filter(is_active=True)
    serializer_class = users_serializers.AssistantSerializer
    permission_classes = [perms.HasInSpeacialistGroup]

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class StudentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Student.objects.select_related('faculty', 'major', 'sclass', 'academic_year', 'educational_system').filter(is_active=True)
    serializer_class = users_serializers.StudentSerializer
    pagination_class = paginators.StudentPagination

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('get_reports'):
            return queryset.prefetch_related('reports')

        if self.action.__eq__('get_activities'):
            return queryset.prefetch_related('registrations')

        if self.action.__eq__('get_points'):
            return queryset.prefetch_related('points')

        return queryset

    def get_permissions(self):
        if self.action in ['get_activities', 'get_points']:
            return [perms.HasInStudentGroup()]

        if self.action in ['get_reports']:
            return [perms.HasInAssistantGroup()]

        return [perms.HasInAssistantGroup()]

    @action(methods=['get'], detail=True, url_path='reports')
    def get_reports(self, request, pk=None):
        reports = self.get_object().reports.select_related('activity').filter(is_active=True)
        activities = [report.activity for report in reports]

        return factory.get_paginators_response(
            paginator=paginators.ActivityPagination(), request=request,
            serializer_class=activities_serializers.ActivitySerializer, data=activities
        )

    @action(methods=['get'], detail=True, url_path='activities')
    def get_activities(self, request, pk=None):
        activity_status = request.query_params.get('status')
        registrations = self.get_object().registrations.select_related('activity').filter(is_active=True)

        if activity_status and activity_status.__eq__('partd'):
            registrations = registrations.filter(is_attendance=True)

        activities = [registration.activity for registration in registrations]

        return factory.get_paginators_response(
            paginator=paginators.ActivityPagination(), request=request,
            serializer_class=activities_serializers.ActivitySerializer, data=activities
        )

    @action(methods=['get'], detail=True, url_path='points/(?P<semester_code>[^/.]+)')
    def get_points(self, request, pk=None, semester_code=None):
        semester = get_object_or_404(queryset=Semester, code=semester_code)
        student = self.get_object()

        student_summary, training_points = dao.get_statistics_student(semester=semester, student=student)

        criterion_name = request.query_params.get('criterion')
        if criterion_name:
            training_points = training_points.filter(criterion__name__icontains=criterion_name)
            student_summary['training_points'] = schools_serializers.TrainingPointSerializer(training_points, many=True).data

        return Response(data=student_summary, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
