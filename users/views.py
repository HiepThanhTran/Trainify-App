from django.db.models import Sum
from rest_framework import viewsets, permissions, generics, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response

from activities import serializers as activities_serializers
from schools import serializers as schools_serializers
from schools.models import TrainingPoint
from tpm import perms
from users import serializers as users_serializers
from users.models import Account, Student, Assistant


class AccountViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = Account.objects.filter(is_active=True)
    serializer_class = users_serializers.AccountSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ["current_account"]:
            return [permissions.IsAuthenticated()]

        if self.action.__eq__("create"):
            return [perms.AllowedCreateAccount()]

        return [permissions.IsAdminUser()]

    @action(methods=["get"], detail=False, url_path="current-account")
    def current_account(self, request):
        return Response(data=users_serializers.AccountSerializer(request.user).data, status=status.HTTP_200_OK)


class AssistantViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Assistant.objects.filter(is_active=True)
    serializer_class = users_serializers.AssistantSerializer
    permission_classes = [perms.HasInActivitiesGroup]


class StudentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Student.objects.filter(is_active=True)
    serializer_class = users_serializers.StudentSerializer

    def get_permissions(self):
        if self.action in ["current_student", "update_current_student", "training_points", "activities"]:
            return [perms.IsStudent()]

        return [perms.HasInActivitiesGroup()]

    @action(methods=["get"], detail=False, url_path="current-student")
    def current_student(self, request):
        return Response(data=users_serializers.StudentSerializer(request.user.student).data, status=status.HTTP_200_OK)

    @action(methods=["get"], detail=True, url_path="training-points")
    def training_points(self, request, pk=None):
        """
        Lấy danh sách điểm rèn luyện của sinh viên lọc theo học kỳ và tiêu chí
        Nhận vào 2 tham số là id của học kỳ và id của tiêu chí
        """
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

    @action(methods=["get"], detail=True, url_path="activities")
    def activities(self, request, pk=None):
        """
        Lấy danh sách hoạt động mà sinh viên đã tham gia hoặc đã đăng ký
        Nhận vào 1 tham số là q:
            Nếu q là "partd" thì lấy danh sách hoạt động mà sinh viên đã tham gia
            Nếu q là "regd" thì lấy danh sách hoạt động mà sinh viên đã đăng ký
        """
        participations = self.get_object().participations.prefetch_related("activity").filter(is_active=True)

        query = self.request.query_params.get('q', None)
        if query is not None:
            participations = participations.filter(is_attendance=True) if query.lower().__eq__("partd") else participations
            participations = participations.filter(is_attendance=False) if query.lower().__eq__("regd") else participations

        activities = [participation.activity for participation in participations]

        return Response(data=activities_serializers.ActivitySerializer(activities, many=True).data, status=status.HTTP_200_OK)
