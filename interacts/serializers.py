from rest_framework import serializers

from interacts.models import Comment


class CommentSerializer(serializers.ModelSerializer):
    # account = AccountSerializer()
    # activity = ActivitySerializer()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_date', 'updated_date', 'account', 'activity']
