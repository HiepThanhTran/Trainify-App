from rest_framework import generics, viewsets, status
from rest_framework.response import Response

from interacts import paginations, serializers, perms
from interacts.models import Comment


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = Comment.objects.filter(is_active=True)
    serializer_class = serializers.CommentSerializer
    pagination_class = paginations.CommentPagination
    permission_classes = [perms.CommentOwner]

    def update(self, request, pk=None):
        comment = self.get_object()
        for field, value in request.data.items():
            setattr(comment, field, value)
        comment.save()

        return Response(data=serializers.CommentSerializer(comment).data, status=status.HTTP_200_OK)
