from cloudinary import api
from rest_framework import viewsets, generics, permissions, status, parsers
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from activities import serializers as activities_serializers
from activities.models import Activity, ActivityRegistration, MissingActivityReport, Bulletin
from core.utils import perms, paginators, filters
from core.utils.dao import dao
from core.utils.factory import factory
from interacts import serializers as interacts_serializers


class BulletinViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveDestroyAPIView):
    queryset = Bulletin.objects.filter(is_active=True).order_by('-created_date')
    serializer_class = activities_serializers.BulletinSerializer
    pagination_class = paginators.BulletinPagination

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('get_activities'):
            return queryset.prefetch_related('activities')

        return queryset

    def get_serializer_class(self):
        if self.action in ['create', 'partial_update']:
            return activities_serializers.BulletinDetailsSerialzer

        return self.serializer_class

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'get_activities']:
            return [permissions.AllowAny()]

        return [perms.HasInAssistantGroup()]

    @action(methods=['get'], detail=True, url_path='activities')
    def get_activities(self, request, pk=None):
        activities = self.get_object().activities.select_related('faculty', 'semester', 'criterion', 'bulletin').all()

        return factory.get_paginators_response(
            paginator=paginators.ActivityPagination(), request=request,
            serializer_class=activities_serializers.ActivitySerializer, data=activities
        )

    @action(methods=['post', 'delete'], detail=True, url_path='activities/(?P<activity_id>[^/.]+)')
    def activity_of_bulletin(self, request, pk=None, activity_id=None):
        activity = get_object_or_404(Activity, pk=activity_id)
        bulletin = self.get_object()
        activity_exists = bulletin.activities.filter(pk=activity.pk).exists()
        if request.method.__eq__('DELETE'):
            if not activity_exists:
                raise ValidationError({'detail': 'Hoạt động không có trong bản tin'})
            bulletin.activities.remove(activity)

            return Response(status=status.HTTP_204_NO_CONTENT)

        if activity_exists:
            raise ValidationError({'detail': 'Hoạt động đã có trong bản tin'})
        bulletin.activities.add(activity)

        serializer = activities_serializers.AuthenticatedActivityDetailsSerializer(activity)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, pk=None):
        serializer = self.get_serializer_class()(instance=self.get_object(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        api.delete_resources(self.get_object().cover.public_id)
        return super().destroy(request, *args, **kwargs)


class ActivityViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveDestroyAPIView):
    queryset = Activity.objects.select_related('faculty', 'semester', 'criterion', 'bulletin').filter(is_active=True).order_by('-created_date')
    serializer_class = activities_serializers.ActivitySerializer
    pagination_class = paginators.ActivityPagination

    def get_queryset(self):
        queryset = self.queryset

        if self.request.user.is_authenticated:
            if self.request.user.has_in_group(name='assistant'):
                return queryset.prefetch_related('participants')

        if self.action.__eq__('comments_of_activity'):
            return queryset.prefetch_related('comments')

        if self.action.__eq__('like_activity'):
            return queryset.prefetch_related('likes')

        return queryset

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            if self.request.user.has_in_group(name='assistant'):
                return activities_serializers.AuthenticatedActivityDetailsSerializer
            return activities_serializers.AuthenticatedActivitySerializer
        return self.serializer_class

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [perms.HasInAssistantGroup()]

        if self.action in ['register_activity', 'report_activity']:
            return [perms.HasInStudentGroup()]

        if self.action in ['comments_of_activity', 'like_activity'] and self.request.method.__eq__('POST'):
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'post'], detail=True, url_path='comments')
    def comments_of_activity(self, request, pk=None):
        if request.method.__eq__('POST'):
            content = request.data.get('content')
            if not content:
                raise ValidationError({'content': 'Nội dung bình luận không được trống'})
            comment = self.get_object().comments.create(content=content, account=request.user)

            serializer = interacts_serializers.CommentSerializer(comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        comments = self.get_object().comments.select_related('account').order_by('-created_date').all()

        return factory.get_paginators_response(
            paginator=paginators.CommentPaginators(), request=request,
            serializer_class=interacts_serializers.CommentSerializer, data=comments
        )

    @action(methods=['post'], detail=True, url_path='like')
    def like_activity(self, request, pk=None):
        like, created = self.get_object().likes.get_or_create(account=request.user)
        like.is_active = not like.is_active if not created else True
        like.save()

        serializer = activities_serializers.AuthenticatedActivitySerializer(self.get_object(), context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True, url_path='register')
    def register_activity(self, request, pk=None):
        registration, created = self.get_object().registrations.get_or_create(student=request.user.student)
        if not created:
            registration.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = activities_serializers.ActivityRegistrationSerializer(registration)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=True, url_path='report', parser_classes=[parsers.MultiPartParser, ])
    def report_activity(self, request, pk=None):
        registration = get_object_or_404(self.get_object().registrations, student=request.user.student)

        if registration.is_point_added:
            raise ValidationError({'detail': 'Bạn không thể báo thiếu hoạt động đã được cộng điểm'})

        content = request.data.get('content', None)
        evidence = request.data.get('evidence', None)

        try:
            report = self.get_object().reports.get(student=request.user.student)
            report.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except MissingActivityReport.DoesNotExist:
            report = self.get_object().reports.create(student=request.user.student, content=content, evidence=evidence)

        serializer = activities_serializers.MissingActivityReportSerializer(report)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk=None):
        serializer = self.get_serializer_class()(self.get_object(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        api.delete_resources(self.get_object().image.public_id)
        return super().destroy(request, *args, **kwargs)


class MissingActivityReportViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = MissingActivityReport.objects.select_related('student', 'activity').filter(is_active=True).order_by('-updated_date')
    serializer_class = activities_serializers.MissingActivityReportSerializer
    pagination_class = paginators.MissingActivityReportPagination
    permission_classes = [perms.HasInAssistantGroup]
    filterset_class = filters.MissingActivityReportFilter

    @action(methods=['post'], detail=True, url_path='confirm')
    def confirm_missing_report(self, request, pk=None):
        missing_report = self.get_object()

        if missing_report.is_resolved is True:
            raise ValidationError({'detail': 'Báo thiếu này đã được giải quyết'})

        registration = ActivityRegistration.objects.get(student=missing_report.student, activity=missing_report.activity)
        dao.update_registration(registration)

        missing_report.is_resolved = True
        missing_report.save()

        serializer = activities_serializers.MissingActivityReportSerializer(missing_report)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(methods=['delete'], detail=True, url_path='reject')
    def reject_missing_report(self, request, pk=None):
        report = self.get_object()
        if report.is_resolved is True:
            raise ValidationError({'detail': 'Không thể xóa báo thiếu đã được giải quyết'})

        report.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
