from rest_framework import viewsets, generics, permissions

from schools import serializers, paginators
from schools.models import EducationalSystem, Faculty, Major, AcademicYear, Class, Semester, Criterion, TrainingPoint, DeficiencyReport, Activity, StudentActivity
from tpm import perms as base_perms


class EducationalSystemViewSet(viewsets.ViewSet):
    queryset = EducationalSystem.objects.filter(is_active=True)
    serializer_class = serializers.EducationalSystemSerializer


class FacultyViewSet(viewsets.ViewSet):
    queryset = Faculty.objects.filter(is_active=True)
    serializer_class = serializers.FacultySerializer


class MajorViewSet(viewsets.ViewSet):
    queryset = Major.objects.filter(is_active=True)
    serializer_class = serializers.MajorSerializer


class AcademicYearViewSet(viewsets.ViewSet):
    queryset = AcademicYear.objects.filter(is_active=True)
    serializer_class = serializers.AcademicYearSerializer


class ClassViewSet(viewsets.ViewSet):
    queryset = Class.objects.filter(is_active=True)
    serializer_class = serializers.ClassSerializer


class SemesterViewSet(viewsets.ViewSet):
    queryset = Semester.objects.filter(is_active=True)
    serializer_class = serializers.SemesterSerializer


class CriterionViewSet(viewsets.ViewSet):
    queryset = Criterion.objects.filter(is_active=True)
    serializer_class = serializers.CriterionSerializer


class TrainingPointViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = TrainingPoint.objects.filter(is_active=True)
    serializer_class = serializers.TrainingPointSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects \
        .select_related('semester', 'created_by', 'criterion') \
        .prefetch_related('list_of_participants') \
        .filter(is_active=True)
    serializer_class = serializers.ActivitySerializer
    pagination_class = paginators.ActivityPagination
    permission_classes = [base_perms.HasActivitiesGroupPermission]


class StudentActivityViewSet(viewsets.ViewSet):
    queryset = StudentActivity.objects \
        .select_related('student', 'activity') \
        .filter(is_active=True)
    serializer_class = serializers.StudentActivitySerializer
    permission_classes = [base_perms.HasActivitiesGroupPermission]


class DeficiencyReportViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = DeficiencyReport.objects.filter(is_active=True)
    serializer_class = serializers.DeficiencyReportSerializer

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            q = self.request.query_params.get('q')

            if q:
                queryset = queryset.filter(student__faculty__name__icontains=q).distinct()

        return queryset

    def get_permissions(self):
        if self.action in ["list", "create"]:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]
