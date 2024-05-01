import csv

from rest_framework import viewsets, generics, permissions, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response

from schools import serializers, paginators, perms
from schools.models import Criterion, TrainingPoint, DeficiencyReport, Activity, Participation
from tpm import perms as base_perms
from users.models import Student


# class EducationalSystemViewSet(viewsets.ViewSet, generics.ListAPIView):
#     queryset = EducationalSystem.objects.filter(is_active=True)
#     serializer_class = serializers.EducationalSystemSerializer
#
#
# class FacultyViewSet(viewsets.ViewSet, generics.ListAPIView):
#     queryset = Faculty.objects.filter(is_active=True)
#     serializer_class = serializers.FacultySerializer
#
#
# class MajorViewSet(viewsets.ViewSet, generics.ListAPIView):
#     queryset = Major.objects.filter(is_active=True)
#     serializer_class = serializers.MajorSerializer
#
#
# class ClassViewSet(viewsets.ViewSet, generics.ListAPIView):
#     queryset = Class.objects.filter(is_active=True)
#     serializer_class = serializers.ClassSerializer


class CriterionViewSet(viewsets.ViewSet):
    queryset = Criterion.objects.filter(is_active=True)
    serializer_class = serializers.CriterionSerializer


class TrainingPointViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = TrainingPoint.objects.filter(is_active=True)
    serializer_class = serializers.TrainingPointSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects \
        .prefetch_related('list_of_participants') \
        .filter(is_active=True)
    serializer_class = serializers.ActivitySerializer
    pagination_class = paginators.ActivityPagination

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy", "upload_attendance_csv"]:
            return [base_perms.HasActivitiesGroupPermission()]

        if self.action in ["register_activity"]:
            return [perms.IsStudent()]

        return [permissions.AllowAny()]

    @action(methods=["post"], detail=True, url_path="register-activity")
    def register_activity(self, request, pk=None):
        participation, created = self.get_object().participations.get_or_create(student=request.user.student)

        if not created:
            return Response(data={"message": "Bạn đã đăng ký tham gia hoạt động này rồi!"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(data=serializers.ParticipationSerializer(participation).data, status=status.HTTP_201_CREATED)

    @action(methods=["post"], detail=False, url_path="upload-attendance-csv")
    def upload_attendance_csv(self, request):
        file = request.FILES.get('file', None)
        if file is None:
            return Response(data={"message": "Không tìm thấy file!"}, status=status.HTTP_400_BAD_REQUEST)

        if not file.name.endswith('.csv'):
            return Response(data={"message": "Vui lòng upload file có định dạng là csv."}, status=status.HTTP_400_BAD_REQUEST)

        csv_data = csv.reader(file.read().decode('utf-8').splitlines())
        next(csv_data)
        for row in csv_data:
            student_code, activity_id = row
            student = Student.objects.get(code=student_code)
            activity = Activity.objects.get(pk=activity_id)
            if student and activity:
                participation, _ = Participation.objects.get_or_create(student=student, activity=activity)
                if not participation.is_attendance:
                    training_point, _ = TrainingPoint.objects.get_or_create(
                        semester=activity.semester, criterion=activity.criterion, student=student
                    )
                    training_point.point += activity.point
                    training_point.save()

                    participation.is_point_added = True
                    participation.is_attendance = True
                    participation.save()

        return Response(data={"message": "Upload file điểm danh thành công"}, status=status.HTTP_200_OK)


class DeficiencyReportViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = DeficiencyReport.objects.filter(is_active=True)
    serializer_class = serializers.DeficiencyReportSerializer

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            query = self.request.query_params.get('q')

            if query:
                queryset = queryset.filter(student__faculty__name__icontains=query).distinct()

        return queryset

    def get_permissions(self):
        if self.action in ["list", "create"]:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]
