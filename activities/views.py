from django.utils.decorators import method_decorator
from rest_framework import viewsets, generics, permissions, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response

from activities import serializers as activities_serializers
from activities import swaggerui as swagger_schema
from activities.models import Activity, ActivityRegistration, MissingActivityReport
from interacts import serializers as interacts_serializers
from tpm import paginators, perms
from tpm.filters import MissingActivityReportFilter
from tpm.utils import dao


class ActivityViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveAPIView):
    queryset = Activity.objects \
        .select_related("faculty", "semester", "criterion", "organizer_type") \
        .prefetch_related("participants").filter(is_active=True).order_by("-updated_date")
    serializer_class = activities_serializers.ActivitySerializer
    pagination_class = paginators.ActivityPagination

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            if self.request.user.has_in_group(name="assistant"):
                return activities_serializers.AuthenticatedActivityDetailsSerializer

            return activities_serializers.AuthenticatedActivitySerializer

        return self.serializer_class

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [perms.HasInAssistantGroup()]

        if self.action in ["register_activity", "report_missing_activity"]:
            return [perms.HasInStudentGroup()]

        if self.action in ["add_comment", "like"]:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @method_decorator(swagger_schema.activities_list_schema())
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(swagger_schema.activity_detail_schema())
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @method_decorator(swagger_schema.get_comments_schema())
    @action(methods=["get"], detail=True, url_path="comments")
    def get_comments(self, request, pk=None):
        comments = self.get_object().comment_set.select_related("account").order_by("-updated_date").all()

        paginator = paginators.CommentPaginators()
        page = paginator.paginate_queryset(comments, request)
        if page is not None:
            serializer = interacts_serializers.CommentSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        return Response(data=interacts_serializers.CommentSerializer(comments, many=True).data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.add_comment_schema())
    @action(methods=["post"], detail=True, url_path="comments/add")
    def add_comment(self, request, pk=None):
        comment = self.get_object().comments.create(content=request.data["content"], account=request.user)

        return Response(interacts_serializers.CommentSerializer(comment).data, status=status.HTTP_201_CREATED)

    @method_decorator(swagger_schema.like_activity_schema())
    @action(methods=["post"], detail=True, url_path="like")
    def like(self, request, pk=None):
        like, created = self.get_object().likes.get_or_create(account=request.user)
        if not created:
            like.is_active = not like.is_active
            like.save()

        serializer = activities_serializers.AuthenticatedActivitySerializer(self.get_object(), context={"request": request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.register_activity_schema())
    @action(methods=["post"], detail=True, url_path="register")
    def register_activity(self, request, pk=None):
        registration, created = self.get_object().registrations.get_or_create(student=request.user.student_summary)
        if not created:
            registration.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(data=activities_serializers.ActivityRegistrationSerializer(registration).data, status=status.HTTP_201_CREATED)

    @method_decorator(swagger_schema.report_activity_schema())
    @action(methods=["post"], detail=True, url_path="report", parser_classes=[parsers.MultiPartParser, ])
    def report_missing_activity(self, request, pk=None):
        try:
            registration = self.get_object().registrations.get(student=request.user.student_summary)
        except ActivityRegistration.DoesNotExist:
            return Response(data={"message": "Bạn chưa đăng ký tham gia hoạt động này"}, status=status.HTTP_400_BAD_REQUEST)

        if registration.is_attendance and registration.is_point_added:
            return Response(data={"message": "Bạn không thể báo thiếu hoạt động đã được cộng điểm"}, status=status.HTTP_400_BAD_REQUEST)

        content = request.data.get("content", None)
        evidence = request.data.get("evidence", None)
        report, created = self.get_object().reports.get_or_create(student=request.user.student_summary, content=content, evidence=evidence)

        if not created:
            report.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(data=activities_serializers.MissingActivityReportSerializer(report).data, status=status.HTTP_201_CREATED)


class MissingActivityReportViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = MissingActivityReport.objects.select_related("student", "activity").filter(is_active=True).order_by("-updated_date")
    serializer_class = activities_serializers.MissingActivityReportSerializer
    pagination_class = paginators.MissingActivityReportPagination
    permission_classes = [perms.HasInAssistantGroup]
    filterset_class = MissingActivityReportFilter

    @method_decorator(swagger_schema.missing_reports_list_schema())
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(swagger_schema.confirm_missing_report_schema())
    @action(methods=["post"], detail=True, url_path="confirm")
    def confirm_missing_report(self, request, pk=None):
        missing_report = self.get_object()

        if missing_report.is_resolved is True:
            return Response(data={"message": "Báo thiếu này đã được giải quyết!"}, status=status.HTTP_400_BAD_REQUEST)

        registration = ActivityRegistration.objects.get(student=missing_report.student_summary, activity=missing_report.activity)

        dao.update_training_point(registration)

        missing_report.is_resolved = True
        missing_report.save()

        return Response(data=activities_serializers.MissingActivityReportSerializer(missing_report).data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.reject_missing_report_schema())
    @action(methods=["delete"], detail=True, url_path="reject")
    def reject_missing_report(self, request, pk=None):
        report = self.get_object()
        if report.is_resolved is True:
            return Response(data={"message": "Không thể xóa báo thiếu"}, status=status.HTTP_400_BAD_REQUEST)

        report.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
