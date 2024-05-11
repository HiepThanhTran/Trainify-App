from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema, no_body
from rest_framework import status

from schools import serializers as schools_serializers


def criterion_list_schema():
    return swagger_auto_schema(
        responses={status.HTTP_200_OK: schools_serializers.CriterionSerializer(many=True)},
        operation_summary="Danh sách tiêu chí đánh giá",
    )


def semester_list_schema():
    return swagger_auto_schema(
        responses={status.HTTP_200_OK: schools_serializers.SemesterSerializer(many=True)},
        operation_summary="Danh sách học kỳ",
    )


def attendace_upload_csv_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name='file',
                required=True,
                type=openapi.TYPE_FILE,
                in_=openapi.IN_FORM,
                format=openapi.FORMAT_BINARY,
                description='File điểm danh cần upload'
            )
        ],
        responses={status.HTTP_200_OK: 'Upload file điểm danh thành công'},
        operation_summary="Upload file điểm danh",
    )


def statistics_by_class_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='semester_code',
                required=True,
                type=openapi.TYPE_INTEGER,
                in_=openapi.IN_PATH,
                description='Mã học kỳ cần thống kê'
            ),
            openapi.Parameter(
                name='class',
                required=False,
                type=openapi.TYPE_STRING,
                in_=openapi.IN_QUERY,
                description='Tên lớp cần thống kê'
            ),
        ],
        responses={status.HTTP_200_OK: schools_serializers.StatisticsByClassSerializer},
        operation_summary="Thống kê điểm rèn luyện của các lớp trong học kỳ",
    )


def statistics_by_faculty_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='semester_code',
                required=True,
                type=openapi.TYPE_INTEGER,
                in_=openapi.IN_PATH,
                description='Mã học kỳ cần thống kê'
            ),
            openapi.Parameter(
                name='faculty',
                required=False,
                type=openapi.TYPE_STRING,
                in_=openapi.IN_QUERY,
                description='Tên khoa cần thống kê'
            ),
        ],
        responses={status.HTTP_200_OK: schools_serializers.StatisticsByFacultySerializer},
        operation_summary="Thống kê điểm rèn luyện của các khoa trong học kỳ",
    )


def statistics_by_school_schema():
    return swagger_auto_schema(
        responses={status.HTTP_200_OK: schools_serializers.StatisticsBySchoolSerializer},
        operation_summary="Thống kê điểm rèn luyện của toàn trường",
    )
