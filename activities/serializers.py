from rest_framework import serializers

from activities.models import ExtracurricularActivity


class ExtracurricularActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtracurricularActivity
        fields = "__all__"
        exclude = ["slug", ]
