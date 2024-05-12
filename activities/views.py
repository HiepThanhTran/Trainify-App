from django.utils.decorators import method_decorator
from rest_framework import viewsets, generics, permissions, status, parsers
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from activities import serializers as activities_serializers
from activities import swaggerui as swagger_schema
from activities.models import Activity, ActivityRegistration, MissingActivityReport, Bulletin
from core import paginators, perms
from core.filters import MissingActivityReportFilter
from core.utils import dao
from interacts import serializers as interacts_serializers


class BulletinViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveDestroyAPIView):
    queryset = Bulletin.objects.filter(is_active=True).prefetch_related('activities').order_by('-created_date')
    serializer_class = activities_serializers.BulletinSerializer
    pagination_class = paginators.BulletinPagination
    parser_classes = [parsers.MultiPartParser, ]

    def get_serializer_class(self):
        if self.action in ['create', 'partial_update']:
            return activities_serializers.BulletinDetailsSerialzer

        return self.serializer_class

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'get_activities']:
            return [permissions.AllowAny()]

        return [perms.HasInAssistantGroup()]

    @method_decorator(swagger_schema.get_activities_of_bulletin_schema())
    @action(methods=['get'], detail=True, url_path='activities')
    def get_activities(self, request, pk=None):
        activities = self.get_object().activities.select_related('faculty', 'semester', 'criterion', 'organizer_type').all()

        paginator = paginators.ActivityPagination()
        page = paginator.paginate_queryset(activities, request)
        if page is not None:
            serializer = activities_serializers.ActivitySerializer(page, many=True, exclude=['bulletin'])
            return paginator.get_paginated_response(serializer.data)

        serializer = activities_serializers.ActivitySerializer(activities, many=True, exclude=['bulletin'])
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.add_activity_to_bulletin_schema())
    @action(methods=['post'], detail=True, url_path='activities/add')
    def add_activity(self, request, pk=None):
        activity = get_object_or_404(Activity, pk=request.data['activity_id'])
        bulletin = self.get_object()

        if bulletin.activities.filter(pk=activity.pk).exists():
            return Response(data={'message': 'Hoạt động đã có trong bản tin'}, status=status.HTTP_400_BAD_REQUEST)

        bulletin.activities.add(activity)
        serializer = activities_serializers.BulletinDetailsSerialzer(bulletin)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.remove_activity_from_bulletin_schema())
    @action(methods=['delete'], detail=True, url_path='activities/remove')
    def remove_activity(self, request, pk=None):
        activity = get_object_or_404(Activity, pk=request.data['activity_id'])
        bulletin = self.get_object()

        if not bulletin.activities.filter(pk=activity.pk).exists():
            return Response(data={'message': 'Hoạt động không có trong bản tin'}, status=status.HTTP_400_BAD_REQUEST)

        bulletin.activities.remove(activity)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @method_decorator(swagger_schema.bulletin_list_schema())
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(swagger_schema.bulletin_retrieve_schema())
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @method_decorator(swagger_schema.bulletin_create_schema())
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @method_decorator(swagger_schema.bulletin_partial_update_schema())
    def partial_update(self, request, pk=None):
        bulletin = self.get_object()
        serializer = self.serializer_class(bulletin, data=request.data, partial=True)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.bulletin_destroy_schema())
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ActivityViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveDestroyAPIView):
    queryset = Activity.objects \
        .select_related('faculty', 'semester', 'criterion', 'organizer_type') \
        .prefetch_related('participants').filter(is_active=True).order_by('-created_date')
    serializer_class = activities_serializers.ActivitySerializer
    pagination_class = paginators.ActivityPagination
    parser_classes = [parsers.MultiPartParser, ]

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            if self.request.user.has_in_group(name='assistant'):
                return activities_serializers.AuthenticatedActivityDetailsSerializer

            return activities_serializers.AuthenticatedActivitySerializer

        return self.serializer_class

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [perms.HasInAssistantGroup()]

        if self.action in ['register_activity', 'report_missing_activity']:
            return [perms.HasInStudentGroup()]

        if self.action in ['add_comment', 'like_activity']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @method_decorator(swagger_schema.get_comments_of_activity_schema())
    @action(methods=['get'], detail=True, url_path='comments')
    def get_comments(self, request, pk=None):
        comments = self.get_object().comment_set.select_related('account').order_by('-created_date').all()

        paginator = paginators.CommentPaginators()
        page = paginator.paginate_queryset(comments, request)
        if page is not None:
            serializer = interacts_serializers.CommentSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = interacts_serializers.CommentSerializer(comments, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.add_comment_to_activity_schema())
    @action(methods=['post'], detail=True, url_path='comments/add')
    def add_comment(self, request, pk=None):
        comment = self.get_object().comments.create(content=request.data.get('content', ''), account=request.user)

        serializer = interacts_serializers.CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @method_decorator(swagger_schema.like_activity_schema())
    @action(methods=['post'], detail=True, url_path='like')
    def like_activity(self, request, pk=None):
        like, created = self.get_object().likes.get_or_create(account=request.user)
        if not created:
            like.is_active = not like.is_active
            like.save()

        serializer = activities_serializers.AuthenticatedActivitySerializer(self.get_object(), context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.register_activity_schema())
    @action(methods=['post'], detail=True, url_path='register')
    def register_activity(self, request, pk=None):
        registration, created = self.get_object().registrations.get_or_create(student=request.user.student)
        if not created:
            registration.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = activities_serializers.ActivityRegistrationSerializer(registration)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)

    @method_decorator(swagger_schema.report_activity_schema())
    @action(methods=['post'], detail=True, url_path='report', parser_classes=[parsers.MultiPartParser, ])
    def report_missing_activity(self, request, pk=None):
        registration = get_object_or_404(self.get_object().registrations, student=request.user.student)

        if registration.is_attendance and registration.is_point_added:
            return Response(data={'message': 'Bạn không thể báo thiếu hoạt động đã được cộng điểm'}, status=status.HTTP_400_BAD_REQUEST)

        content = request.data.get('content', None)
        evidence = request.data.get('evidence', None)
        report, created = self.get_object().reports.get_or_create(student=request.user.student, content=content, evidence=evidence)

        if not created:
            report.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = activities_serializers.MissingActivityReportSerializer(report)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)

    @method_decorator(swagger_schema.activities_list_schema())
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(swagger_schema.activity_retrieve_schema())
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @method_decorator(swagger_schema.activity_create_schema())
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @method_decorator(swagger_schema.activity_partial_update_schema())
    def partial_update(self, request, pk=None):
        activity = self.get_object()
        serializer = self.serializer_class(activity, data=request.data, partial=True)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.activity_destroy_schema())
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class MissingActivityReportViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = MissingActivityReport.objects.select_related('student', 'activity').filter(is_active=True).order_by('-updated_date')
    serializer_class = activities_serializers.MissingActivityReportSerializer
    pagination_class = paginators.MissingActivityReportPagination
    permission_classes = [perms.HasInAssistantGroup]
    filterset_class = MissingActivityReportFilter

    @method_decorator(swagger_schema.confirm_missing_report_schema())
    @action(methods=['post'], detail=True, url_path='confirm')
    def confirm_missing_report(self, request, pk=None):
        missing_report = self.get_object()

        if missing_report.is_resolved is True:
            return Response(data={'message': 'Báo thiếu này đã được giải quyết'}, status=status.HTTP_400_BAD_REQUEST)

        registration = ActivityRegistration.objects.get(student=missing_report.student, activity=missing_report.activity)

        dao.update_training_point(registration)

        missing_report.is_resolved = True
        missing_report.save()

        serializer = activities_serializers.MissingActivityReportSerializer(missing_report)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.reject_missing_report_schema())
    @action(methods=['delete'], detail=True, url_path='reject')
    def reject_missing_report(self, request, pk=None):
        report = self.get_object()
        if report.is_resolved is True:
            return Response(data={'message': 'Không thể xóa báo thiếu đã được giải quyết'}, status=status.HTTP_400_BAD_REQUEST)

        report.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @method_decorator(swagger_schema.missing_reports_list_schema())
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(swagger_schema.missing_reports_retrieve_schema())
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
