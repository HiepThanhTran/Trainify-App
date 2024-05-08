from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status

from activities import serializers as activities_serializers
from schools import serializers as schools_serializers
from users import serializers as users_serializers


def current_account_schema():
    return swagger_auto_schema(
        responses={status.HTTP_200_OK: users_serializers.AccountSerializer},
        operation_description="API sử dụng để lấy thông tin tài khoản hiện tại",
    )


def create_account_schema(parameter_description, operation_description):
    return swagger_auto_schema(
        request_body=users_serializers.AccountSerializer,
        manual_parameters=[
            openapi.Parameter(
                name="key",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_STRING,
                description=parameter_description,
                required=True,
            ),
            openapi.Parameter(
                name="avatar",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                required=False,
            ),
        ],
        responses={status.HTTP_201_CREATED: users_serializers.AccountSerializer},
        operation_description=operation_description,
    )


def students_list_schema():
    return swagger_auto_schema(
        responses={status.HTTP_200_OK: openapi.Response(
            description="Danh sách sinh viên",
            schema=users_serializers.StudentSerializer(many=True),
        )},
        operation_description="API sử dụng để lấy danh sách sinh viên",
    )


def student_details_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID của sinh viên",
                required=True,
            ),
        ],
        responses={status.HTTP_200_OK: openapi.Response(
            description="Thông tin chi tiết của sinh viên",
            schema=users_serializers.StudentSerializer,
        )},
        operation_description="API sử dụng để lấy thông tin chi tiết của một sinh viên",
    )


def current_student_schema():
    return swagger_auto_schema(
        responses={status.HTTP_200_OK: openapi.Response(
            description="Thông tin của sinh viên hiện tại đang đăng nhập",
            schema=users_serializers.StudentSerializer,
        )},
        operation_description="API sử dụng để lấy thông tin của sinh viên hiện tại đang đăng nhập",
    )


def activities_list_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID của sinh viên",
                required=True,
            ),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Danh sách các hoạt động của sinh viên",
                schema=activities_serializers.ActivitySerializer(many=True),
            )
        },
        operation_description="API sử dụng để lấy danh sách các hoạt động của sinh viên",
    )


def activities_participated_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID của sinh viên",
                required=True,
            ),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Danh sách các hoạt động sinh viên đã tham gia",
                schema=activities_serializers.ActivitySerializer(many=True),
            )
        },
        operation_description="API sử dụng để lấy danh sách các hoạt động sinh viên đã tham gia",
    )


def activities_registered_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID của sinh viên",
                required=True,
            ),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Danh sách các hoạt động sinh viên đã đăng ký",
                schema=activities_serializers.ActivitySerializer(many=True),
            )
        },
        operation_description="API sử dụng để lấy danh sách các hoạt động sinh viên đã đăng ký",
    )


def activities_reported_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID của sinh viên",
                required=True,
            ),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Danh sách các hoạt động sinh viên báo thiếu",
                schema=activities_serializers.ActivitySerializer(many=True),
            )
        },
        operation_description="API sử dụng để lấy danh sách các hoạt động sinh viên báo thiếu",
    )


def training_points_schema():
    return swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID của sinh viên",
                required=True,
            ),
            openapi.Parameter(
                name="semester",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description="ID học kỳ cần lọc",
                required=False,
            ),
            openapi.Parameter(
                name="criterion",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description="ID quy chế cần lọc",
                required=False,
            ),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Danh sách điểm rèn luyện (lọc theo học kỳ và quy chế)",
                schema=schools_serializers.TrainingPointBySemesterSerializer(many=True),
            )
        },
        operation_description="API sử dụng để lấy danh sách điểm rèn luyện của sinh viên",
    )
