from rest_framework import serializers


class BaseSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)

        image = rep.get("image", None)
        if image:
            rep["image"] = instance.image.url

        avatar = rep.get("avatar", None)
        if avatar:
            rep["avatar"] = instance.avatar.url

        return rep
