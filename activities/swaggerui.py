from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema, no_body
from rest_framework import status

from activities import serializers as activities_serializers
from interacts import serializers as interacts_serializers


def activities_list_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='page',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description='Trang',
                required=False,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description='Danh sách hoạt động',
            schema=activities_serializers.ActivitySerializer(many=True)
        )},
        operation_description='API lấy danh sách các hoạt động',
    )


def activity_detail_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID hoạt động',
                required=True,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description='Thông tin chi tiết của hoạt động',
            schema=activities_serializers.ActivitySerializer,
        )},
        operation_description='API lấy thông tin chi tiết của một hoạt động',
    )


def get_comments_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID hoạt động',
                required=True,
            ),
            openapi.Parameter(
                name='page',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description='Trang',
                required=False,
            ),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description='Danh sách bình luận của hoạt động',
                schema=interacts_serializers.CommentSerializer(many=True),
            )
        },
        operation_description='API lấy danh sách bình luận của hoạt động',
    )


def add_comment_schema():
    return swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'content': openapi.Schema(type=openapi.TYPE_STRING, description='Nội dung bình luận'),
            },
            required=['content'],
        ),
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID hoạt động',
                required=True,
            ),
        ],
        responses={status.HTTP_201_CREATED: openapi.Response(
            description='Thông tin bình luận của hoạt động',
            schema=interacts_serializers.CommentSerializer,
        )},
        operation_description='API thêm bình luận cho hoạt động',
    )


def like_activity_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID hoạt động',
                required=True,
            ),
        ],
        responses={status.HTTP_200_OK: activities_serializers.AuthenticatedActivitySerializer},
        operation_description='API thích hoạt động',
    )


def register_activity_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID hoạt động',
                required=True,
            ),
        ],
        responses={
            status.HTTP_201_CREATED: openapi.Response(
                description='Thông tin phiếu đăng ký tham gia hoạt động của sinh viên',
                schema=activities_serializers.ActivityRegistrationSerializer,
            )
        },
        operation_description='API đăng ký tham gia hoạt động cho sinh viên',
    )


def report_activity_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID hoạt động',
                required=True,
            ),
            openapi.Parameter(
                name='image',
                in_=openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                required=False,
                description='Hình ảnh minh chứng (Nếu có)',
            ),
            openapi.Parameter(
                name='content',
                in_=openapi.IN_FORM,
                type=openapi.TYPE_STRING,
                required=False,
                description='Nội dung báo thiếu hoạt động',
            ),
        ],
        responses={
            status.HTTP_201_CREATED: openapi.Response(
                description='Thông tin báo thiếu hoạt động của sinh viên',
                schema=activities_serializers.MissingActivityReportSerializer,
            )
        },
        operation_description='API báo thiếu hoạt động cho sinh viên',
    )


def missing_reports_list_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='faculty',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description='Khoa',
                required=False,
            ),
            openapi.Parameter(
                name='page',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description='Trang',
                required=False,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description='Danh sách báo thiếu của sinh viên',
            schema=activities_serializers.MissingActivityReportSerializer(many=True)
        )},
        operation_description='API lấy danh sách các báo thiếu của sinh viên (lọc theo khoa)',
    )


def missing_reports_retrieve_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID phiếu báo thiếu',
                required=True,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description='Danh sách báo thiếu của sinh viên',
            schema=activities_serializers.MissingActivityReportSerializer(many=True)
        )},
        operation_description='API lấy danh sách các báo thiếu của sinh viên (lọc theo khoa)',
    )


def confirm_missing_report_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID phiếu báo thiếu',
                required=True,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description='Thông tin báo thiếu vừa xác nhận',
            schema=activities_serializers.MissingActivityReportSerializer
        )},
        operation_description='API xác nhận báo thiếu hoạt động của sinh viên',
    )


def reject_missing_report_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID phiếu báo thiếu',
                required=True,
            ),
        ],
        responses={status.HTTP_204_NO_CONTENT: 'Từ chối báo thiếu thành công'},
        operation_description='API từ chối báo thiếu hoạt động của sinh viên',
    )
