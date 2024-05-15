from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema, no_body
from rest_framework import status

from activities import serializers as activities_serializers
from interacts import serializers as interacts_serializers


def get_activities_of_bulletin_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID bản tin',
                required=True,
            ),
            openapi.Parameter(
                name='page',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description='Số trang',
                required=False,
            ),
        ],
        responses={status.HTTP_200_OK: activities_serializers.BulletinDetailsSerialzer},
        operation_summary='Danh sách hoạt động trong bản tin',
    )


def activity_of_bulletin_schema(method):
    if method == 'delete':
        return remove_activity_from_bulletin_schema()

    return add_activity_to_bulletin_schema()


def add_activity_to_bulletin_schema():
    return swagger_auto_schema(
        method='post',
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID bản tin',
                required=True,
            ),
            openapi.Parameter(
                name='activity_id',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description='ID hoạt động',
                required=True,
            ),
        ],
        responses={status.HTTP_200_OK: activities_serializers.BulletinDetailsSerialzer},
        operation_summary='Thêm hoạt động vào bản tin',
    )


def remove_activity_from_bulletin_schema():
    return swagger_auto_schema(
        method='delete',
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID bản tin',
                required=True,
            ),
            openapi.Parameter(
                name='activity_id',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description='ID hoạt động',
                required=True,
            ),
        ],
        responses={status.HTTP_204_NO_CONTENT: ''},
        operation_summary='Xóa hoạt động khỏi bản tin',
    )


def comments_of_activity_schema(method):
    if method == 'post':
        return add_comment_to_activity_schema()
    return get_comments_of_activity_schema()


def get_comments_of_activity_schema():
    return swagger_auto_schema(
        method='get',
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
                name='page',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description='Số trang',
                required=False,
            ),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description='Danh sách bình luận của hoạt động',
                schema=interacts_serializers.CommentSerializer(many=True),
            )
        },
        operation_summary="Danh sách bình luận của một hoạt động ngoại khóa",
    )


def add_comment_to_activity_schema():
    return swagger_auto_schema(
        method='post',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'content': openapi.Schema(type=openapi.TYPE_STRING),
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
            description='Thông tin bình luận vừa tạo',
            schema=interacts_serializers.CommentSerializer,
        )},
        operation_summary="Thêm bình luận cho hoạt động ngoại khóa",
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
        operation_summary="Thích hoạt động ngoại khóa",
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
        operation_summary="Đăng ký tham gia hoạt động ngoại khóa",
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
                description='Nội dung báo thiếu hoạt động (Nếu có)',
            ),
        ],
        responses={
            status.HTTP_201_CREATED: openapi.Response(
                description='Thông tin báo thiếu hoạt động của sinh viên',
                schema=activities_serializers.MissingActivityReportSerializer,
            )
        },
        operation_summary="Báo thiếu hoạt động ngoại khóa",
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
        operation_summary="Xác nhận báo thiếu của sinh viên",
    )


def reject_missing_report_schema():
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
        responses={status.HTTP_204_NO_CONTENT: ''},
        operation_summary="Từ chối báo thiếu của sinh viên",
    )


def bulletin_list_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name='page',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description='Số trang',
                required=False,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description='Danh sách bản tin',
            schema=activities_serializers.BulletinSerializer(many=True)
        )},
        operation_summary="Danh sách các bản tin",
    )


def bulletin_retrieve_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID bản tin',
                required=True,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description='Thông tin chi tiết của bản tin',
            schema=activities_serializers.BulletinSerializer,
        )},
        operation_summary="Xem thông tin chi tiết của một bản tin",
    )


def bulletin_create_schema():
    return swagger_auto_schema(
        responses={status.HTTP_200_OK: openapi.Response(
            description='Thông tin bản tin vừa tạo',
            schema=activities_serializers.BulletinDetailsSerialzer,
        )},
        operation_summary="Tạo bản tin mới", )


def bulletin_partial_update_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID bản tin',
                required=True,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description='Thông tin chi tiết của bản tin sau khi cập nhật',
            schema=activities_serializers.BulletinDetailsSerialzer,
        )},
        operation_summary="Cập nhật một phần thông tin của bản tin",
    )


def bulletin_destroy_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID bản tin',
                required=True,
            ),
        ],
        responses={status.HTTP_204_NO_CONTENT: ''},
        operation_summary='Xóa bản tin',
    )


def activities_list_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name='page',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description='Số trang',
                required=False,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description='Danh sách hoạt động',
            schema=activities_serializers.ActivitySerializer(many=True)
        )},
        operation_summary="Danh sách các hoạt động ngoại khóa",
    )


def activity_retrieve_schema():
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
        responses={status.HTTP_200_OK: openapi.Response(
            description='Thông tin chi tiết của hoạt động',
            schema=activities_serializers.ActivitySerializer,
        )},
        operation_summary="Xem thông tin chi tiết của một hoạt động ngoại khóa",
    )


def activity_create_schema():
    return swagger_auto_schema(
        responses={status.HTTP_200_OK: openapi.Response(
            description='Thông tin của hoạt động vừa tạo',
            schema=activities_serializers.ActivitySerializer,
        )},
        operation_summary="Tạo hoạt động ngoại khóa mới",
    )


def activity_partial_update_schema():
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
            description='Thông tin chi tiết của hoạt động sau khi cập nhật',
            schema=activities_serializers.ActivitySerializer,
        )},
        operation_summary="Cập nhật một phần thông tin của hoạt động ngoại khóa",
    )


def activity_destroy_schema():
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
        responses={status.HTTP_204_NO_CONTENT: ''},
        operation_summary='Xóa hoạt động ngoại khóa',
    )


def missing_reports_list_schema():
    return swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name='faculty',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description='Tên khoa cần lọc',
                required=False,
            ),
            openapi.Parameter(
                name='page',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description='Số trang',
                required=False,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description='Danh sách báo thiếu của sinh viên',
            schema=activities_serializers.MissingActivityReportSerializer(many=True)
        )},
        operation_summary="Danh sách báo thiếu của sinh viên theo khoa",
    )


def missing_reports_retrieve_schema():
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
            description='Danh sách báo thiếu của sinh viên',
            schema=activities_serializers.MissingActivityReportSerializer(many=True)
        )},
        operation_summary="Xem thông tin chi tiết báo thiếu của sinh viên",
    )
