from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, viewsets, status
from rest_framework.response import Response

from interacts import serializers
from interacts.models import Comment
from tpm import paginators, perms


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = Comment.objects.select_related('account', 'activity').filter(is_active=True)
    serializer_class = serializers.CommentSerializer
    pagination_class = paginators.CommentPaginators
    permission_classes = [perms.AllowedEditComment]

    @swagger_auto_schema(
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
        operation_description='API sử dụng để cập nhật bình luận hoạt động của người dùng',
    )
    def update(self, request, pk=None):
        comment = self.get_object()

        fields_is_validated = ['content']
        for field in fields_is_validated:
            if field in request.data:
                setattr(comment, field, request.data[field])
        comment.save()

        return Response(data=serializers.CommentSerializer(comment).data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='ID bình luận',
                required=True,
            ),
        ],
        responses={status.HTTP_204_NO_CONTENT: 'Xóa bình luận thành công'},
        operation_description='API sử dụng để xóa bình luận hoạt động của người dùng',
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
