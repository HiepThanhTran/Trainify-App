import csv

from django.db import transaction
from django.utils.decorators import method_decorator
from rest_framework import viewsets, generics, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response

from activities.models import Activity, ActivityRegistration
from schools import serializers as schools_serializers
from schools import swaggerui as swagger_schema
from schools.models import Criterion, Semester, SemesterOfStudent
from tpm import perms
from tpm.utils import dao
from users.models import Student


class CriterionViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Criterion.objects.filter(is_active=True)
    serializer_class = schools_serializers.CriterionSerializer

    @method_decorator(swagger_schema.criterion_list_schema())
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class SemesterViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Semester.objects.filter(is_active=True)
    serializer_class = schools_serializers.SemesterSerializer

    @method_decorator(swagger_schema.semester_list_schema())
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class StatisticsViewSet(viewsets.ViewSet):
    permission_classes = [perms.HasInAssistantGroup]

    @method_decorator(swagger_schema.statistics_by_class_schema())
    @action(methods=['get'], detail=False, url_path='points/classes/(?P<semester_code>[^/.]+)')
    def statistics_points_by_class(self, request, semester_code=None):
        class_name = request.query_params.get('class')
        statistics_data = dao.get_statistics_points_by_class(semester_code=semester_code, class_name=class_name)

        return Response(data=statistics_data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.statistics_by_faculty_schema())
    @action(methods=['get'], detail=False, url_path='points/faculties/(?P<semester_code>[^/.]+)')
    def statistics_points_by_faculty(self, request, semester_code=None):
        faculty_name = request.query_params.get('faculty')
        statistics_data = dao.get_statistics_points_by_faculty(semester_code=semester_code, faculty_name=faculty_name)

        return Response(data=statistics_data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.statistics_by_school_schema())
    @action(methods=['get'], detail=False, url_path='points/school')
    def statistics_points_by_school(self, request):
        statistics_data = dao.get_statistics_points_by_school()

        return Response(data=statistics_data, status=status.HTTP_200_OK)


class FileUploadAndExportViewSet(viewsets.ViewSet):
    permission_classes = [perms.HasInAssistantGroup]
    parser_classes = [parsers.MultiPartParser, ]

    @method_decorator(swagger_schema.attendace_upload_csv_schema())
    @action(methods=['post'], detail=False, url_path='attendance/upload/csv')
    def attendace_upload_csv(self, request):
        file = request.FILES.get('file', None)
        if file is None:
            return Response(data={'message': 'Không tìm thấy file!'}, status=status.HTTP_400_BAD_REQUEST)

        if not file.name.endswith('.csv'):
            return Response(data={'message': 'Vui lòng upload file có định dạng là csv'}, status=status.HTTP_400_BAD_REQUEST)

        csv_data = self.process_csv_file(file)

        with transaction.atomic():
            for row in csv_data:
                student_code, activity_id = row
                try:
                    student = Student.objects.get(code=student_code)
                    activity = Activity.objects.get(pk=activity_id)
                except (Student.DoesNotExist, Activity.DoesNotExist):
                    continue

                registration, _ = ActivityRegistration.objects.get_or_create(student=student, activity=activity)
                if registration.is_attendance and registration.is_point_added:
                    continue

                SemesterOfStudent.objects.get_or_create(semester=activity.semester, student=student)
                dao.update_training_point(registration)

        return Response(data={'message': 'Upload file điểm danh thành công'}, status=status.HTTP_200_OK)

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

    @staticmethod
    def process_csv_file(file):
        csv_data = csv.reader(file.read().decode('utf-8').splitlines())
        next(csv_data)
        return list(csv_data)
