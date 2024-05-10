from rest_framework import serializers

from activities.models import Activity, ActivityRegistration, MissingActivityReport
from interacts.models import Like
from tpm.serializers import BaseSerializer
from tpm.utils import factory


class ActivitySerializer(BaseSerializer):
    class Meta:
        model = Activity
        exclude = ["is_active", "participants", "organizer_type", "organizer_id"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        image = data.get("image", None)
        if image:
            data["image"] = instance.image.url

        data["criterion"] = instance.criterion.name
        data["semester"] = instance.semester.full_name
        data["faculty"] = instance.faculty.name

        return data

    def create(self, validated_data):
        data = validated_data.copy()
        request = self.context.get("request")

        instance, _ = factory.check_account_role(request.user)
        organizer = getattr(request.user, instance, None)

        data["organizer"] = organizer
        activity = Activity.objects.create(**data)

        return activity


class AuthenticatedActivitySerializer(ActivitySerializer):
    liked = serializers.SerializerMethodField()

    class Meta:
        model = ActivitySerializer.Meta.model
        exclude = ActivitySerializer.Meta.exclude

    def get_liked(self, instance):
        request = self.context.get("request")

        try:
            like = Like.objects.get(account=request.user, activity=instance)
        except Like.DoesNotExist:
            return False

        return like.is_active


class AuthenticatedActivityDetailsSerializer(AuthenticatedActivitySerializer):
    from users import serializers as user_serializers
    list_of_participants = user_serializers.StudentSerializer(many=True, required=False)

    organizer = serializers.SerializerMethodField()

    class Meta:
        model = ActivitySerializer.Meta.model
        exclude = ["is_active", "organizer_type", "organizer_id"]

    def get_organizer(self, instance):
        _, serializer_class, _ = factory.check_user_instance(instance.organizer)

        return serializer_class(instance.organizer).data


class ActivityRegistrationSerializer(BaseSerializer):
    from users import serializers as user_serializers
    student = user_serializers.StudentSerializer()
    activity = ActivitySerializer()

    class Meta:
        model = ActivityRegistration
        exclude = ["is_active"]
        extra_kwargs = {
            "is_attendance": {
                "read_only": True,
            },
            "is_point_added": {
                "read_only": True,
            }
        }


class MissingActivityReportSerializer(BaseSerializer):
    from users import serializers as user_serializers
    student = user_serializers.StudentSerializer()
    activity = ActivitySerializer()

    class Meta:
        model = MissingActivityReport
        exclude = ["is_active"]
        extra_kwargs = {
            "is_resolved": {
                "read_only": "true",
            }
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)

        evidence = data.get("evidence", None)
        if evidence:
            data["evidence"] = instance.evidence.url

        return data
