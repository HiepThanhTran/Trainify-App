from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema, no_body
from rest_framework import status

from activities import serializers as activities_serializers
from interacts import serializers as interacts_serializers


def activities_list_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name="page",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description="Trang",
                required=False,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description="Danh sách hoạt động",
            schema=activities_serializers.ActivitySerializer(many=True)
        )},
        operation_description="API sử dụng để lấy danh sách các hoạt động",
    )


def activity_detail_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID hoạt động",
                required=True,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description="Thông tin chi tiết của hoạt động",
            schema=activities_serializers.ActivitySerializer,
        )},
        operation_description="API sử dụng để lấy thông tin chi tiết của một hoạt động",
    )


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


def get_comments_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID hoạt động",
                required=True,
            ),
            openapi.Parameter(
                name="page",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description="Trang",
                required=False,
            ),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Danh sách bình luận của hoạt động",
                schema=interacts_serializers.CommentSerializer(many=True),
            )
        },
        operation_description="API sử dụng để lấy danh sách bình luận của hoạt động",
    )


def add_comment_schema():
    return swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "content": openapi.Schema(type=openapi.TYPE_STRING, description="Nội dung bình luận"),
            },
            required=["content"],
        ),
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID hoạt động",
                required=True,
            ),
        ],
        responses={status.HTTP_201_CREATED: openapi.Response(
            description="Thông tin bình luận của hoạt động",
            schema=interacts_serializers.CommentSerializer,
        )},
        operation_description="API sử dụng để thêm bình luận cho hoạt động",
    )


def like_activity_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID hoạt động",
                required=True,
            ),
        ],
        responses={status.HTTP_200_OK: activities_serializers.AuthenticatedActivitySerializer},
        operation_description="API sử dụng để thích hoạt động",
    )


def register_activity_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID hoạt động",
                required=True,
            ),
        ],
        responses={
            status.HTTP_201_CREATED: openapi.Response(
                description="Thông tin phiếu đăng ký tham gia hoạt động của sinh viên",
                schema=activities_serializers.ParticipationSerializer,
            )
        },
        operation_description="API sử dụng để đăng ký tham gia hoạt động cho sinh viên",
    )


def report_deficiency_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID hoạt động",
                required=True,
            ),
            openapi.Parameter(
                name="image",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                required=False,
                description="Hình ảnh minh chứng (Nếu có)",
            ),
            openapi.Parameter(
                name="content",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_STRING,
                required=False,
                description="Nội dung báo thiếu hoạt động",
            ),
        ],
        responses={
            status.HTTP_201_CREATED: openapi.Response(
                description="Thông tin báo thiếu hoạt động của sinh viên",
                schema=activities_serializers.DeficiencyReportSerializer,
            )
        },
        operation_description="API sử dụng để báo thiếu hoạt động cho sinh viên",
    )


def report_deficiency_list_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name="faculty",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description="Khoa",
                required=True,
            ),
            openapi.Parameter(
                name="page",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description="Trang",
                required=False,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description="Danh sách báo thiếu của sinh viên",
            schema=activities_serializers.DeficiencyReportSerializer(many=True)
        )},
        operation_description="API sử dụng để lấy danh sách các báo thiếu của sinh viên (lọc theo khoa)",
    )


def confirm_deficiency_report_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID phiếu báo thiếu",
                required=True,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description="Thông tin báo thiếu vừa xác nhận",
            schema=activities_serializers.DeficiencyReportSerializer
        )},
        operation_description="API sử dụng để xác nhận báo thiếu hoạt động của sinh viên",
    )


def refuse_deficiency_report_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID phiếu báo thiếu",
                required=True,
            ),
        ],
        responses={status.HTTP_204_NO_CONTENT: "Từ chối báo thiếu thành công"},
        operation_description="API sử dụng để từ chối báo thiếu hoạt động của sinh viên",
    )
