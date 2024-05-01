from rest_framework import serializers


class BaseSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)

        filtered_data = {
            key: value for key, value in data.items() if value is not None
        }

        return filtered_data
