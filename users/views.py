from django.utils.decorators import method_decorator
from rest_framework import viewsets, permissions, generics, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response

from activities import serializers as activities_serializers
from schools import serializers as schools_serializers
from schools.models import Semester
from tpm import perms, paginators
from tpm.utils import factory, dao
from users import serializers as users_serializers
from users import swaggerui as swagger_schema
from users.models import Account, Student, Assistant


class AccountViewSet(viewsets.ViewSet):
    queryset = Account.objects.filter(is_active=True)
    serializer_class = users_serializers.AccountSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ["current_account"]:
            return [permissions.IsAuthenticated()]

        if self.action in ["create_assistant_account"]:
            return [perms.HasInSpeacialistGroup()]

        return [permissions.AllowAny()]

    @method_decorator(swagger_schema.current_account_schema())
    @action(methods=["get"], detail=False, url_path="current")
    def current_account(self, request):
        return Response(data=users_serializers.AccountSerializer(request.user).data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.create_account_schema(
        parameter_description="ID của trợ lý sinh viên",
        operation_description="API tạo tài khoản cho trợ lý sinh viên")
    )
    @action(methods=["post"], detail=False, url_path="assistant/add")
    def create_assistant_account(self, request):
        return self._create_account(request, Assistant)

    @method_decorator(swagger_schema.create_account_schema(
        parameter_description="Mã số sinh viên",
        operation_description="API tạo tài khoản cho sinh viên")
    )
    @action(methods=["post"], detail=False, url_path="student/add")
    def create_student_account(self, request):
        return self._create_account(request, Student)

    def _create_account(self, request, user_model):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            key = serializer.validated_data.pop("key")
            response_data = factory.create_user_account(serializer.validated_data, key, user_model)

            if isinstance(response_data, Response):
                return response_data

            return Response(data=users_serializers.AccountSerializer(response_data).data, status=status.HTTP_201_CREATED)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssistantViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Assistant.objects.filter(is_active=True)
    serializer_class = users_serializers.AssistantSerializer
    permission_classes = [perms.HasInSpeacialistGroup]


class StudentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Student.objects.filter(is_active=True)
    serializer_class = users_serializers.StudentSerializer
    pagination_class = paginators.StudentPagination

    def get_permissions(self):
        if self.action in ["current_student", "activities_list", "activities_participated", "activities_registered", "training_points"]:
            return [perms.HasInStudentGroup()]

        if self.action in ["activities_reported"]:
            return [perms.HasInAssistantGroup()]

        return [perms.HasInAssistantGroup()]

    @method_decorator(swagger_schema.students_list_schema())
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(swagger_schema.student_details_schema())
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @method_decorator(swagger_schema.current_student_schema())
    @action(methods=["get"], detail=False, url_path="current")
    def current_student(self, request):
        return Response(data=users_serializers.StudentSerializer(request.user.student_summary).data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.activities_list_schema())
    @action(methods=["get"], detail=True, url_path="activities")
    def activities_list(self, request, pk=None):
        return self.get_activities_by_participation_status(pk=pk)

    @method_decorator(swagger_schema.activities_participated_schema())
    @action(methods=["get"], detail=True, url_path="activities/participated")
    def activities_participated(self, request, pk=None):
        return self.get_activities_by_participation_status(pk=pk, is_attendance=True)

    @method_decorator(swagger_schema.activities_registered_schema())
    @action(methods=["get"], detail=True, url_path="activities/registered")
    def activities_registered(self, request, pk=None):
        return self.get_activities_by_participation_status(pk=pk, is_attendance=False)

    @method_decorator(swagger_schema.activities_reported_schema())
    @action(methods=["get"], detail=True, url_path="activities/reported")
    def activities_reported(self, request, pk=None):
        reports = self.get_object().deficiency_reports.all()
        activities = [report.activity for report in reports]

        return Response(data=activities_serializers.ActivitySerializer(activities, many=True).data, status=status.HTTP_200_OK)

    def get_activities_by_participation_status(self, pk=None, is_attendance=None):
        participations = self.get_object().participations.prefetch_related("activity").filter(is_active=True)
        if is_attendance is not None:
            participations = participations.filter(is_attendance=is_attendance)
        activities = [participation.activity for participation in participations]

        return Response(data=activities_serializers.ActivitySerializer(activities, many=True).data, status=status.HTTP_200_OK)

    @action(methods=["get"], detail=True, url_path="points/(?P<semester_code>[^/.]+)")
    def training_points(self, request, pk=None, semester_code=None):
        student = Student.objects.prefetch_related("semesters", "points").only("id", "code").get(pk=pk)

        try:
            semester = student.semesters.get(code=semester_code)
        except Semester.DoesNotExist:
            return Response(data={"message": "Không tìm thấy học kỳ"}, status=status.HTTP_404_NOT_FOUND)

        student_summary, training_points = dao.get_student_summary(semester=semester, student=student)

        criterion_name = request.query_params.get("criterion")
        if criterion_name:
            training_points = training_points.filter(criterion__name__icontains=criterion_name)

        student_summary["training_points"] = schools_serializers.TrainingPointSerializer(training_points, many=True).data

        return Response(data=student_summary, status=status.HTTP_200_OK)
