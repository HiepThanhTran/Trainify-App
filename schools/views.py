import csv

from django.db import transaction
from rest_framework import viewsets, generics, status, parsers
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from activities.models import Activity, ActivityRegistration
from core.utils import perms
from core.utils.dao import dao
from core.utils.validations import validate_file_with_format
from schools import serializers as schools_serializers
from schools import swaggerui as swagger_schema
from schools.models import Criterion, Semester, Class, Faculty
from users.models import Student


class CriterionViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Criterion.objects.filter(is_active=True)
    serializer_class = schools_serializers.CriterionSerializer

    @swagger_schema.criterion_list_schema()
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class SemesterViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Semester.objects.filter(is_active=True)
    serializer_class = schools_serializers.SemesterSerializer

    @swagger_schema.semester_list_schema()
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class StatisticsViewSet(viewsets.ViewSet):
    permission_classes = [perms.HasInAssistantGroup]

    @action(methods=['get'], detail=False, url_path='school')
    def statistics_points_of_school(self, request):
        statistics_data = dao.get_statistics_points_of_school()
        return Response(data=statistics_data, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False, url_path='points/(?P<semester_code>[^/.]+)')
    def statistics_points(self, request, semester_code=None):
        semester = get_object_or_404(queryset=Semester, code=semester_code)
        faculty_id = request.query_params.get('faculty_id')
        class_id = request.query_params.get('class_id')
        faculty, sclass = None, None

        if not faculty_id and not class_id:
            raise ValidationError({'detail': 'Vui lòng thống kê theo khoa hoặc lớp học hoặc cả 2'})

        if faculty_id and not class_id:
            faculty = get_object_or_404(Faculty, pk=faculty_id)
        elif not faculty_id and class_id:
            sclass = get_object_or_404(Class, pk=class_id)
        else:
            faculty = get_object_or_404(Faculty, pk=faculty_id)
            sclass = get_object_or_404(Class, pk=class_id, major__faculty=faculty)

        statistics_data = dao.get_statistics(semester=semester, faculty=faculty, sclass=sclass)
        return Response(data=statistics_data, status=status.HTTP_200_OK)


class FileViewSet(viewsets.ViewSet):
    permission_classes = [perms.HasInAssistantGroup]
    parser_classes = [parsers.MultiPartParser, ]

    @swagger_schema.attendace_upload_csv_schema()
    @action(methods=['post'], detail=False, url_path='attendance/upload/csv')
    def attendace_upload_csv(self, request):
        file = request.FILES.get('file', None)
        validate_file_with_format(file=file, fformat='.csv')
        csv_data = csv.reader(file.read().decode('utf-8').splitlines())
        next(csv_data)

        with transaction.atomic():
            for row in csv_data:
                student_code, activity_id = row
                try:
                    student = Student.objects.get(code=student_code)
                    activity = Activity.objects.get(pk=activity_id)
                    registration = ActivityRegistration.objects.select_related('student', 'activity').get(student=student, activity=activity)
                    if registration.is_point_added:
                        continue
                    dao.update_registration(registration)
                except (Student.DoesNotExist, Activity.DoesNotExist, ActivityRegistration.DoesNotExist):
                    continue

        return Response(data={'detail': 'Upload file điểm danh thành công'}, status=status.HTTP_200_OK)

    # @action(detail=False, methods=['get'])
    # def export_statistics(self, request):
    #     file_format = request.query_params.get('format', 'pdf')
    #
    #     statistics_data = dao.get_training_points_statistics()
    #
    #     if file_format == 'pdf':
    #         pdf_file = generate_pdf(statistics_data)
    #         return FileResponse(pdf_file, as_attachment=True, filename='statistics.pdf')
    #     elif file_format == 'csv':
    #         csv_file = generate_csv(statistics_data)
    #         return FileResponse(csv_file, as_attachment=True, filename='statistics.csv')
    #
    #     return Response(status=status.HTTP_400_BAD_REQUEST)
