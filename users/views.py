from cloudinary import uploader
from django.utils.decorators import method_decorator
from rest_framework import viewsets, permissions, generics, status, parsers
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from activities import serializers as activities_serializers
from core import perms, paginators
from core.utils import factory, dao
from schools import serializers as schools_serializers
from schools.models import Semester
from users import serializers as users_serializers
from users import swaggerui as swagger_schema
from users.models import Account, Student, Assistant


class AccountViewSet(viewsets.ViewSet):
    queryset = Account.objects.filter(is_active=True)
    serializer_class = users_serializers.AccountSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ['get_current_account', 'partial_update_current_account']:
            return [permissions.IsAuthenticated()]

        if self.action in ['create_assistant_account']:
            return [perms.HasInSpeacialistGroup()]

        return [permissions.AllowAny()]

    @method_decorator(swagger_schema.get_current_account_schema())
    @action(methods=['get'], detail=False, url_path='current')
    def get_current_account(self, request):
        serializer = self.serializer_class(request.user)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.partial_update_current_account_schema())
    @action(methods=['patch'], detail=False, url_path='current/update')
    def partial_update_current_account(self, request):
        data = request.data
        account = request.user

        fields_is_validated = ['password', 'avatar']
        for field in fields_is_validated:
            if field in data:
                if field.__eq__('avatar'):
                    data[field] = uploader.upload_resource(file=data[field], public_id=account.email, unique_filename=False, overwrite=True)
                setattr(account, field, data[field])
        account.save()

        serializer = self.serializer_class(account)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.create_account_schema(
        parameter_description='Mã trợ lý sinh viên',
        operation_summary='Tạo tài khoản cho trợ lý sinh viên')
    )
    @action(methods=['post'], detail=False, url_path='assistants')
    def create_assistant_account(self, request):
        return self._create_account(request, Assistant)

    @method_decorator(swagger_schema.create_account_schema(
        parameter_description='Mã số sinh viên',
        operation_summary='Tạo tài khoản cho sinh viên')
    )
    @action(methods=['post'], detail=False, url_path='students')
    def create_student_account(self, request):
        return self._create_account(request, Student)

    def _create_account(self, request, user_model):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        key = serializer.validated_data.pop('key')
        response_data = factory.create_user_account(serializer.validated_data, key, user_model)

        if isinstance(response_data, Response):
            return response_data

        serializer = self.serializer_class(response_data)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)


class AssistantViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Assistant.objects.filter(is_active=True)
    serializer_class = users_serializers.AssistantSerializer
    permission_classes = [perms.HasInSpeacialistGroup]

    @method_decorator(swagger_schema.assistants_list_schema())
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(swagger_schema.assistants_retrieve_schema())
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class StudentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Student.objects.filter(is_active=True)
    serializer_class = users_serializers.StudentSerializer
    pagination_class = paginators.StudentPagination

    STUDENT_ACTION = [
        'get_current_student',
        'get_activities',
        'get_activities_participated',
        'get_activities_registered',
        'get_training_points_statistics'
    ]

    def get_permissions(self):
        if self.action in self.STUDENT_ACTION:
            return [perms.HasInStudentGroup()]

        if self.action in ['get_activities_reported']:
            return [perms.HasInAssistantGroup()]

        return [perms.HasInAssistantGroup()]

    @method_decorator(swagger_schema.get_activities_of_student_schema())
    @action(methods=['get'], detail=True, url_path='activities')
    def get_activities(self, request, pk=None):
        return self.get_activities_by_registrations_status(request=request, pk=pk)

    @method_decorator(swagger_schema.get_activities_participated_of_student_schema())
    @action(methods=['get'], detail=True, url_path='activities/participated')
    def get_activities_participated(self, request, pk=None):
        return self.get_activities_by_registrations_status(request=request, pk=pk, is_attendance=True)

    @method_decorator(swagger_schema.get_activities_registered_of_student_schema())
    @action(methods=['get'], detail=True, url_path='activities/registered')
    def get_activities_registered(self, request, pk=None):
        return self.get_activities_by_registrations_status(request=request, pk=pk, is_attendance=False)

    def get_activities_by_registrations_status(self, request, pk=None, is_attendance=None):
        registrations = self.get_object().registrations.select_related('activity').filter(is_active=True)
        if is_attendance is not None:
            registrations = registrations.filter(is_attendance=is_attendance)
        activities = [registration.activity for registration in registrations]

        paginator = paginators.ActivityPagination()
        page = paginator.paginate_queryset(activities, request)
        if page is not None:
            serializer = activities_serializers.ActivitySerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = activities_serializers.ActivitySerializer(activities, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.get_activities_reported_of_student_schema())
    @action(methods=['get'], detail=True, url_path='activities/reported')
    def get_activities_reported(self, request, pk=None):
        reports = self.get_object().reports.select_related('activity').all()
        activities = [report.activity for report in reports]

        serializer = activities_serializers.ActivitySerializer(activities, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.get_training_points_statistics_schema())
    @action(methods=['get'], detail=True, url_path='points/(?P<semester_code>[^/.]+)')
    def get_training_points_statistics(self, request, pk=None, semester_code=None):
        semester = get_object_or_404(Semester, code=semester_code)
        student = Student.objects.prefetch_related('points').only('id', 'code').get(pk=pk)

        student_summary, training_points = dao.get_student_summary(semester=semester, student=student)

        criterion_name = request.query_params.get('criterion')
        if criterion_name:
            training_points = training_points.filter(criterion__name__icontains=criterion_name)
            student_summary['training_points'] = schools_serializers.TrainingPointSerializer(training_points, many=True).data

        return Response(data=student_summary, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.students_list_schema())
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(swagger_schema.student_retrieve_schema())
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
