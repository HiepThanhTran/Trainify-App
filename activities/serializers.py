from rest_framework import serializers

from activities.models import Activity, ActivityRegistration, MissingActivityReport, Bulletin
from core.serializers import BaseSerializer
from core.utils.factory import factory
from interacts.models import Like


class ActivitySerializer(BaseSerializer):
    class Meta:
        model = Activity
        fields = [
            'id', 'name', 'participant', 'start_date', 'end_date', 'location', 'point',
            'bulletin', 'faculty', 'semester', 'criterion',
            'image', 'organizational_form', 'description',
            'updated_date', 'created_date',
        ]

    def to_representation(self, activity):
        data = super().to_representation(activity)
        image = data.get('image', None)

        if 'image' in self.fields and image:
            data['image'] = activity.image.url
        if 'criterion' in self.fields and activity.criterion:
            data['criterion'] = activity.criterion.name
        if 'semester' in self.fields and activity.semester:
            data['semester'] = activity.semester.full_name
        if 'faculty' in self.fields and activity.faculty:
            data['faculty'] = activity.faculty.name
        if 'bulletin' in self.fields and activity.bulletin:
            data['bulletin'] = activity.bulletin.title

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        image = validated_data.pop('image', None)

        instance, _ = factory.check_account_role(request.user)
        validated_data['organizer'] = getattr(request.user, instance, None)
        activity = Activity.objects.create(**validated_data)

        activity.image = factory.get_or_upload(file=image, public_id=f'activity-{activity.id}' if image else image, ftype='activity')
        activity.save()

        return activity

    def update(self, activity, validated_data):
        if 'image' in validated_data:
            validated_data['image'] = factory.get_or_upload(file=validated_data['image'], public_id=f'activity-{activity.id}')

        for key, value in validated_data.items():
            setattr(activity, key, value)
        activity.save()

        return activity


class AuthenticatedActivitySerializer(ActivitySerializer):
    liked = serializers.SerializerMethodField()

    class Meta:
        model = ActivitySerializer.Meta.model
        fields = ActivitySerializer.Meta.fields + ['liked']

    def get_liked(self, activity):
        request = self.context.get('request')

        try:
            like = Like.objects.get(account=request.user, activity=activity)
        except Like.DoesNotExist:
            return False

        return like.is_active


class AuthenticatedActivityDetailsSerializer(AuthenticatedActivitySerializer):
    from users import serializers as user_serializers
    participants = user_serializers.StudentSerializer(many=True, required=False, fields=['id', 'full_name', 'code'])
    organizer = serializers.SerializerMethodField()

    class Meta:
        model = ActivitySerializer.Meta.model
        fields = ActivitySerializer.Meta.fields + ['organizer', 'participants']

    def get_organizer(self, activity):
        _, serializer_class, _ = factory.check_user_instance(activity.organizer)

        return serializer_class(activity.organizer).data


class BulletinSerializer(BaseSerializer):
    class Meta:
        model = Bulletin
        fields = ['id', 'title', 'content', 'cover', 'created_date', 'updated_date']

    def to_representation(self, bulletin):
        data = super().to_representation(bulletin)
        cover = data.get('cover')

        if 'cover' in self.fields and cover:
            data['cover'] = bulletin.cover.url

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        cover = validated_data.pop('cover', None)

        instance, _ = factory.check_account_role(request.user)
        validated_data['poster'] = getattr(request.user, instance, None)
        bulletin = Bulletin.objects.create(**validated_data)

        bulletin.cover = factory.get_or_upload(file=cover, public_id=f'bulletin-{bulletin.id}' if cover else None, ftype='bulletin')
        bulletin.save()

        return bulletin

    def update(self, bulletin, validated_data):
        if 'cover' in validated_data:
            validated_data['cover'] = factory.get_or_upload(file=validated_data['cover'], public_id=f'bulletin-{bulletin.id}')

        for key, value in validated_data.items():
            setattr(bulletin, key, value)
        bulletin.save()

        return bulletin


class BulletinDetailsSerialzer(BulletinSerializer):
    activities = ActivitySerializer(many=True, required=False)
    poster = serializers.SerializerMethodField()

    class Meta:
        model = BulletinSerializer.Meta.model
        fields = BulletinSerializer.Meta.fields + ['poster', 'activities']

    def get_poster(self, bulletin):
        _, serializer_class, _ = factory.check_user_instance(bulletin.poster)

        return serializer_class(bulletin.poster).data


class ActivityRegistrationSerializer(BaseSerializer):
    from users import serializers as user_serializers
    student = user_serializers.StudentSerializer()
    activity = ActivitySerializer()

    class Meta:
        model = ActivityRegistration
        fields = ['id', 'is_attendance', 'is_point_added', 'student', 'activity', 'created_date', 'updated_date']


class MissingActivityReportSerializer(BaseSerializer):
    from users import serializers as user_serializers
    student = user_serializers.StudentSerializer()
    activity = ActivitySerializer()

    class Meta:
        model = MissingActivityReport
        fields = ['id', 'is_resolved', 'content', 'evidence', 'student', 'activity', 'created_date', 'updated_date']

    def to_representation(self, instance):
        data = super().to_representation(instance)

        evidence = data.get('evidence', None)
        if 'evidence' in self.fields and evidence:
            data['evidence'] = instance.evidence.url

        return data
