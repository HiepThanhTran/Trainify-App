from rest_framework import serializers

from activities.serializers import ExtracurricularActivitySerializer
from interacts.models import Comment
from users.serializers import AccountSerializer


class CommentSerializer(serializers.ModelSerializer):
    user = AccountSerializer()
    activity = ExtracurricularActivitySerializer()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_date', 'updated_date', 'user', 'activity', ]
