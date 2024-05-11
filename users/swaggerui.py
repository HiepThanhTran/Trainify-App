from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status

from activities import serializers as activities_serializers
from schools import serializers as schools_serializers
from users import serializers as users_serializers


def get_current_account_schema():
    return swagger_auto_schema(
        responses={status.HTTP_200_OK: users_serializers.AccountSerializer},
        operation_summary='Thông tin tài khoản đang đăng nhập',
    )


def partial_update_current_account_schema():
    return swagger_auto_schema(
        responses={status.HTTP_200_OK: users_serializers.AccountSerializer},
        operation_summary='Cập nhật thông tin tài khoản đang đăng nhập',
    )


def create_account_schema(parameter_description=None, operation_summary=None):
    return swagger_auto_schema(
        request_body=users_serializers.AccountSerializer,
        manual_parameters=[
            openapi.Parameter(
                name='key',
                in_=openapi.IN_FORM,
                type=openapi.TYPE_STRING,
                description=parameter_description,
                required=True,
            ),
            openapi.Parameter(
                name='avatar',
                in_=openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                required=False,
            ),
        ],
        responses={status.HTTP_201_CREATED: users_serializers.AccountSerializer},
        operation_summary=operation_summary,
    )


def assistants_list_schema():
    return swagger_auto_schema(
        responses={status.HTTP_200_OK: openapi.Response(
            description='Danh sách trợ lý sinh viên',
            schema=users_serializers.AssistantSerializer(many=True),
        )},
        operation_summary='Danh sách trợ lý sinh viên',
    )


def assistants_retrieve_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID của trợ lý sinh viên',
                required=True,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description='Thông tin chi tiết của trợ lý sinh viên',
            schema=users_serializers.AssistantSerializer,
        )},
        operation_summary='Thông tin chi tiết của trợ lý sinh viên',
    )


def students_list_schema():
    return swagger_auto_schema(
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
            description='Danh sách sinh viên',
            schema=users_serializers.StudentSerializer(many=True),
        )},
        operation_summary='Danh sách sinh viên',
    )


def student_retrieve_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID của sinh viên',
                required=True,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description='Thông tin chi tiết của sinh viên',
            schema=users_serializers.StudentSerializer,
        )},
        operation_summary='Thông tin chi tiết của sinh viên',
    )


def get_activities_of_student_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID của sinh viên',
                required=True,
            ),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description='Danh sách các hoạt động của sinh viên',
                schema=activities_serializers.ActivitySerializer(many=True),
            )
        },
        operation_summary='Danh sách các hoạt động của sinh viên',
    )


def get_activities_participated_of_student_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID của sinh viên',
                required=True,
            ),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description='Danh sách các hoạt động sinh viên đã tham gia',
                schema=activities_serializers.ActivitySerializer(many=True),
            )
        },
        operation_summary='Danh sách các hoạt động sinh viên đã tham gia',
    )


def get_activities_registered_of_student_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID của sinh viên',
                required=True,
            ),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description='Danh sách các hoạt động sinh viên đã đăng ký',
                schema=activities_serializers.ActivitySerializer(many=True),
            )
        },
        operation_summary='Danh sách các hoạt động sinh viên đã đăng ký',
    )


def get_activities_reported_of_student_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID của sinh viên',
                required=True,
            ),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description='Danh sách các hoạt động sinh viên báo thiếu',
                schema=activities_serializers.ActivitySerializer(many=True),
            )
        },
        operation_summary='Danh sách các hoạt động sinh viên báo thiếu',
    )


def get_training_points_statistics_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='id',
                required=True,
                type=openapi.TYPE_INTEGER,
                in_=openapi.IN_PATH,
                description='ID sinh viên'
            ),
            openapi.Parameter(
                name='semester_code',
                required=True,
                type=openapi.TYPE_INTEGER,
                in_=openapi.IN_PATH,
                description='Mã học kỳ cần thống kê'
            ),
        ],
        responses={status.HTTP_200_OK: schools_serializers.StudentSummarySerializer()},
        operation_summary='Xem chi tiết điểm rèn luyện của sinh viên',
    )
