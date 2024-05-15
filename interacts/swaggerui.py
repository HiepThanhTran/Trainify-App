from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status

from interacts import serializers


def comment_update_schema():
    return swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'content': openapi.Schema(type=openapi.TYPE_STRING, description='Nội dung bình luận'),
            },
        ),
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID bình luận',
                required=True,
            ),
        ],
        responses={status.HTTP_200_OK: serializers.CommentSerializer},
        operation_summary='Cập nhật bình luận hoạt động của người dùng',
    )


def comment_destroy_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID bình luận',
                required=True,
            ),
        ],
        responses={status.HTTP_204_NO_CONTENT: ''},
        operation_summary='Xóa bình luận hoạt động của người dùng',
    )
