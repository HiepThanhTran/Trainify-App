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
