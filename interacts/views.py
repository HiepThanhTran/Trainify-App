from rest_framework import generics, viewsets, status
from rest_framework.response import Response

from interacts import serializers
from interacts.models import Comment
from tpm import paginators, perms


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = Comment.objects.select_related("account", "activity").filter(is_active=True)
    serializer_class = serializers.CommentSerializer
    pagination_class = paginators.CommentPaginators
    permission_classes = [perms.AllowedEditComment]

    def update(self, request, pk=None):
        comment = self.get_object()

        fields_is_validated = ["content"]
        for field in fields_is_validated:
            if field in request.data:
                setattr(comment, field, request.data[field])
        comment.save()

        return Response(data=serializers.CommentSerializer(comment).data, status=status.HTTP_200_OK)
