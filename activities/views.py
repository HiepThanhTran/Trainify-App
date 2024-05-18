from rest_framework import generics, parsers, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from activities import serializers as activities_serializers
from activities.models import Activity, ActivityRegistration, Bulletin, MissingActivityReport
from core.utils import paginators, perms
from core.utils.dao import dao
from core.utils.factory import factory
from core.utils.validations import validate_date_format
from interacts import serializers as interacts_serializers


class BulletinViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveDestroyAPIView):
    queryset = Bulletin.objects.filter(is_active=True).order_by("-created_date")
    serializer_class = activities_serializers.BulletinSerializer
    pagination_class = paginators.BulletinPagination

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__("list"):
            title = self.request.query_params.get("title")
            queryset = queryset.filter(title__icontains=title) if title else queryset

        return queryset

    def get_serializer_class(self):
        if self.action in ["create", "partial_update"]:
            return activities_serializers.BulletinDetailsSerialzer

        return self.serializer_class

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]

        return [perms.HasInAssistantGroup()]

    @action(methods=["post", "delete"], detail=True, url_path="activities/(?P<activity_id>[^/.]+)")
    def add_or_remove_activity_of_bulletin(self, request, pk=None, activity_id=None):
        activity = get_object_or_404(queryset=Activity, pk=activity_id)
        bulletin = self.get_object()
        activity_exists = bulletin.activities.filter(pk=activity.pk).exists()
        if request.method.__eq__("DELETE"):
            if not activity_exists:
                raise ValidationError({"detail": "Hoạt động không có trong bản tin"})
            bulletin.activities.remove(activity)

            return Response(status=status.HTTP_204_NO_CONTENT)

        if activity_exists:
            raise ValidationError({"detail": "Hoạt động đã có trong bản tin"})
        bulletin.activities.add(activity)

        serializer = activities_serializers.AuthenticatedActivityDetailsSerializer(activity)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, pk=None):
        serializer = self.get_serializer_class()(instance=self.get_object(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(data=serializer.data, status=status.HTTP_200_OK)


class ActivityViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveDestroyAPIView):
    queryset = Activity.objects.select_related("bulletin", "faculty", "semester", "criterion").filter(is_active=True).order_by("-created_date")
    serializer_class = activities_serializers.ActivitySerializer
    pagination_class = paginators.ActivityPagination

    filter_params = ["bulletin_id", "faculty_id", "semester_code", "criterion_id"]

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__("list"):
            for param in self.filter_params:
                value = self.request.query_params.get(param)
                queryset = queryset.filter(**{param: value}) if value else queryset

            name = self.request.query_params.get("name")
            queryset = queryset.filter(name__icontains=name) if name else queryset

            form = self.request.query_params.get("form")
            queryset = queryset.filter(organizational_form__iexact=form) if form else queryset

            start_date = self.request.query_params.get("start_date", "")
            queryset = (queryset.filter(start_date__gte=start_date) if validate_date_format(start_date) else queryset)

            end_date = self.request.query_params.get("end_date", "")
            queryset = queryset.filter(end_date__lte=end_date) if validate_date_format(end_date) else queryset

        queryset = queryset.prefetch_related("comments") if self.action.__eq__("comments") else queryset
        queryset = queryset.prefetch_related("likes") if self.action.__eq__("like_activity") else queryset
        queryset = queryset.prefetch_related("registrations") if self.action.__eq__("register_activity") else queryset
        queryset = queryset.prefetch_related("registrations", "reports") if self.action.__eq__("report_activity") else queryset

        return queryset

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            if self.request.user.has_in_group(name="assistant"):
                return activities_serializers.AuthenticatedActivityDetailsSerializer
            return activities_serializers.AuthenticatedActivitySerializer
        return self.serializer_class

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [perms.HasInAssistantGroup()]

        if self.action in ["register_activity", "report_activity"]:
            return [perms.HasInStudentGroup()]

        if self.action in ["comments", "like_activity"] and self.request.method.__eq__("POST"):
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=["get", "post"], detail=True, url_path="comments")
    def comments(self, request, pk=None):
        if request.method.__eq__("POST"):
            content = request.data.get("content")
            if not content:
                raise ValidationError({"content": "Nội dung bình luận không được trống"})
            comment = self.get_object().comments.create(content=content, account=request.user)

            serializer = interacts_serializers.CommentSerializer(comment)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)

        comments = self.get_object().comments.select_related("account").order_by("-created_date").all()

        return factory.get_paginators_response(
            paginator=paginators.CommentPaginators(), request=request,
            serializer_class=interacts_serializers.CommentSerializer, data=comments
        )

    @action(methods=["post"], detail=True, url_path="like")
    def like_activity(self, request, pk=None):
        like, created = self.get_object().likes.get_or_create(account=request.user)
        like.is_active = not like.is_active if not created else True
        like.save()

        serializer = activities_serializers.AuthenticatedActivitySerializer(self.get_object(), context={"request": request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(methods=["post"], detail=True, url_path="register")
    def register_activity(self, request, pk=None):
        registration, created = self.get_object().registrations.get_or_create(student=request.user.student)
        if not created:
            registration.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = activities_serializers.ActivityRegistrationSerializer(registration)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=["post"], detail=True, url_path="report", parser_classes=[parsers.MultiPartParser, ])
    def report_activity(self, request, pk=None):
        activity = self.get_object()
        registration = get_object_or_404(queryset=activity.registrations, student=request.user.student)
        if registration.is_point_added:
            raise ValidationError({"detail": "Bạn không thể báo thiếu hoạt động đã được cộng điểm"})

        content = request.data.get("content", "")
        evidence = request.data.get("evidence", None)

        try:
            missing_report = activity.reports.get(student=request.user.student)
            missing_report.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except MissingActivityReport.DoesNotExist:
            missing_report = activity.reports.create(student=request.user.student, content=content, evidence=evidence)

        serializer = activities_serializers.MissingActivityReportSerializer(missing_report)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk=None):
        serializer = self.get_serializer_class()(self.get_object(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(data=serializer.data, status=status.HTTP_200_OK)


class MissingActivityReportViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = MissingActivityReport.objects.select_related("student", "activity").filter(is_active=True).order_by("-updated_date")
    serializer_class = activities_serializers.MissingActivityReportSerializer
    pagination_class = paginators.MissingActivityReportPagination
    permission_classes = [perms.HasInAssistantGroup]

    filter_params = ["student_id", "activity_id", "activity__faculty_id"]

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__("list"):
            for param in self.filter_params:
                value = self.request.query_params.get(param)
                queryset = queryset.filter(**{param: value}) if value else queryset

            resolved = self.request.query_params.get("resolved")
            queryset = queryset.filter(is_resolved=resolved) if resolved and (resolved.__eq__("True") or resolved.__eq__("False")) else queryset

        return queryset

    @action(methods=["post"], detail=True, url_path="confirm")
    def confirm_missing_report(self, request, pk=None):
        missing_report = self.get_object()

        if missing_report.is_resolved:
            raise ValidationError({"detail": "Báo thiếu này đã được giải quyết"})

        registration = ActivityRegistration.objects.get(student=missing_report.student, activity=missing_report.activity)
        dao.update_registration(registration)

        missing_report.is_resolved = True
        missing_report.save()

        serializer = self.serializer_class(missing_report)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(methods=["delete"], detail=True, url_path="reject")
    def reject_missing_report(self, request, pk=None):
        missing_report = self.get_object()
        if missing_report.is_resolved is True:
            raise ValidationError({"detail": "Không thể xóa báo thiếu đã được giải quyết"})

        missing_report.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
