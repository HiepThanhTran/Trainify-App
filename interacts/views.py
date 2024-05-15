from django.utils.decorators import method_decorator
from rest_framework import generics, viewsets, status
from rest_framework.response import Response

from core.utils import perms, paginators
from interacts import serializers
from interacts import swaggerui as swagger_schema
from interacts.models import Comment


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = Comment.objects.select_related('account', 'activity').filter(is_active=True)
    serializer_class = serializers.CommentSerializer
    pagination_class = paginators.CommentPaginators
    permission_classes = [perms.AllowedEditComment]

    @method_decorator(swagger_schema.comment_update_schema())
    def update(self, request, pk=None):
        comment = self.get_object()
        serializer = self.serializer_class(comment, data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(data=serializers.CommentSerializer(comment).data, status=status.HTTP_200_OK)

    @method_decorator(swagger_schema.comment_destroy_schema())
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
