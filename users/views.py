from django.db.models import Sum, Q
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, permissions, generics, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response

from activities import serializers as activities_serializers
from schools import serializers as schools_serializers
from schools.models import TrainingPoint
from tpm import perms
from tpm.utils import factory
from users import serializers as users_serializers
from users.models import Account, Student, Assistant


class AccountViewSet(viewsets.ViewSet):
    queryset = Account.objects.filter(is_active=True)
    serializer_class = users_serializers.AccountSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ["current_account"]:
            return [permissions.IsAuthenticated()]

        if self.action in ["create_assistant_account"]:
            return [perms.IsAdministrator(), perms.IsSpecialist()]

        return [permissions.AllowAny()]

    @swagger_auto_schema(
        methods=['get'],
        responses={200: users_serializers.AccountSerializer},
    )
    @action(methods=["get"], detail=False, url_path="current")
    def current_account(self, request):
        return Response(data=users_serializers.AccountSerializer(request.user).data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        methods=['post'],
        request_body=users_serializers.AccountSerializer,
        responses={201: users_serializers.AccountSerializer},
    )
    @action(methods=["post"], detail=False, url_path="assistant")
    def create_assistant_account(self, request):
        return self._create_account(request, Assistant)

    @swagger_auto_schema(
        methods=['post'],
        request_body=users_serializers.AccountSerializer,
        responses={201: users_serializers.AccountSerializer},
    )
    @action(methods=["post"], detail=False, url_path="student")
    def create_student_account(self, request):
        return self._create_account(request, Student)

    def _create_account(self, request, user_model):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            key = serializer.validated_data.pop("key")
            account = factory.create_user_account(serializer.validated_data, key, user_model)
            if account is None:
                return Response(data={"message": "Tạo tài khoản thất bại"}, status=status.HTTP_400_BAD_REQUEST)

            return Response(data=users_serializers.AccountSerializer(account).data, status=status.HTTP_201_CREATED)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssistantViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Assistant.objects.filter(is_active=True)
    serializer_class = users_serializers.AssistantSerializer
    permission_classes = [perms.HasInActivitiesGroup]


class StudentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Student.objects.filter(is_active=True)
    serializer_class = users_serializers.StudentSerializer

    def get_permissions(self):
        if self.action in ["current_student", "training_points", "activities_list", "activities_participated", "activities_registered", "activities_reported"]:
            return [perms.IsStudent()]

        return [perms.HasInActivitiesGroup()]

    @swagger_auto_schema(
        methods=['get'],
        responses={200: users_serializers.StudentSerializer},
    )
    @action(methods=["get"], detail=False, url_path="current")
    def current_student(self, request):
        return Response(data=users_serializers.StudentSerializer(request.user.student).data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        methods=['get'],
        responses={
            200: openapi.Response(
                description="List of training points (According to semester and regulations)",
                schema=schools_serializers.TrainingPointBySemesterSerializer(many=True)
            )
        },
        manual_parameters=[
            openapi.Parameter(
                name='semester',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description="ID học kỳ cần lọc",
                required=False,
            ),
            openapi.Parameter(
                name='criterion',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description="ID quy chế cần lọc",
                required=False,
            )
        ]
    )
    @action(methods=["get"], detail=True, url_path="points")
    def training_points(self, request, pk=None):
        semester_id = request.query_params.get("semester", None)
        criterion_id = request.query_params.get("criterion", None)

        semester_points = []
        student = self.get_object()
        semesters_of_student = student.semesters.all()

        if semester_id is not None:
            semesters_of_student = semesters_of_student.filter(id=semester_id)

        for semester in semesters_of_student:
            training_points = TrainingPoint.objects.filter(student=student, semester=semester)
            total_point_dict = training_points.values("semester_id").annotate(total_point=Sum("point")).order_by('semester_id').first()

            if criterion_id is not None:
                training_points = training_points.filter(criterion_id=criterion_id)

            semester_points.append({
                'semester': semester.name,
                'total_point': total_point_dict.get('total_point') if total_point_dict is not None else 0,
                'training_points': training_points
            })

        serializer = schools_serializers.TrainingPointBySemesterSerializer(semester_points, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        methods=['get'],
        responses={
            200: openapi.Response(
                description="List of activities",
                schema=activities_serializers.ActivitySerializer(many=True)
            )
        }
    )
    @action(methods=["get"], detail=True, url_path="activities")
    def activities_list(self, request, pk=None):
        participations = self.get_activities_by_participation_status(pk=pk)
        activities = [participation.activity for participation in participations]
        return Response(data=activities_serializers.ActivitySerializer(activities, many=True).data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        methods=['get'],
        responses={
            200: openapi.Response(
                description="List of activities participated",
                schema=activities_serializers.ActivitySerializer(many=True)
            )
        }
    )
    @action(methods=["get"], detail=True, url_path="activities/participated")
    def activities_participated(self, request, pk=None):
        activities = self.get_activities_by_participation_status(pk=pk, is_attendance=True)
        return Response(data=activities_serializers.ActivitySerializer(activities, many=True).data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        methods=['get'],
        responses={
            200: openapi.Response(
                description="List of activities registered",
                schema=activities_serializers.ActivitySerializer(many=True)
            )
        }
    )
    @action(methods=["get"], detail=True, url_path="activities/registered")
    def activities_registered(self, request, pk=None):
        activities = self.get_activities_by_participation_status(pk=pk, is_attendance=False)
        return Response(data=activities_serializers.ActivitySerializer(activities, many=True).data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        methods=['get'],
        responses={
            200: openapi.Response(
                description="List of activities reported",
                schema=activities_serializers.ActivitySerializer(many=True)
            )
        }
    )
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
        return activities
