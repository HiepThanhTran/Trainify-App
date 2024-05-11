from rest_framework import serializers

from interacts.models import Comment
from users import serializers as users_serializer


class CommentSerializer(serializers.ModelSerializer):
    account = users_serializer.AccountSerializer()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_date', 'updated_date', 'account']
