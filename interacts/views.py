from rest_framework import generics, viewsets, status
from rest_framework.response import Response

from core.utils import perms, paginators
from interacts import serializers
from interacts.models import Comment


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = Comment.objects.select_related('account', 'activity').filter(is_active=True)
    serializer_class = serializers.CommentSerializer
    pagination_class = paginators.CommentPaginators
    permission_classes = [perms.AllowedEditComment]

    def update(self, request, pk=None):
        comment = self.get_object()
        serializer = self.serializer_class(comment, data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(data=serializers.CommentSerializer(comment).data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
