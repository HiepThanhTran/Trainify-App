from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema, no_body
from rest_framework import status


def attendace_upload_csv_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name="file",
                required=True,
                type=openapi.TYPE_FILE,
                in_=openapi.IN_FORM,
                format=openapi.FORMAT_BINARY,
            )
        ],
        responses={status.HTTP_200_OK: "Upload file điểm danh thành công"}
    )
