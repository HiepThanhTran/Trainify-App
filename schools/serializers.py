from schools.models import Semester, Criterion, TrainingPoint
from tpm.serializers import BaseSerializer


class SemesterSerializer(BaseSerializer):
    class Meta:
        model = Semester
        fields = ['id', 'code', 'full_name', 'start_date', 'end_date', 'academic_year']

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if 'academic_year' in self.fields:
            data['academic_year'] = instance.academic_year.name

        return data


class CriterionSerializer(BaseSerializer):
    class Meta:
        model = Criterion
        fields = ['id', 'name', 'max_point', 'description']


class TrainingPointSerializer(BaseSerializer):
    class Meta:
        model = TrainingPoint
        fields = ['id', 'point', 'criterion']

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if 'criterion' in self.fields:
            data['criterion'] = instance.criterion.name

        return data

# class StudentSummarySerializer(serializers.Serializer):
#     id = serializers.IntegerField()
#     full_name = serializers.CharField()
#     code = serializers.CharField()
#     achievement = serializers.CharField()
#     total_points = serializers.FloatField()
#     training_points = TrainingPointSerializer(many=True)
#
#
# class ClassSummarySerializer(serializers.Serializer):
#     class_name = serializers.CharField()
#     total_students = serializers.IntegerField()
#     total_points = serializers.FloatField()
#     average_points = serializers.FloatField()
#     achievements = serializers.DictField(child=serializers.IntegerField())
#     students = StudentSummarySerializer(many=True)
#
#
# class FacultySummarySerializer(serializers.Serializer):
#     faculty_name = serializers.CharField()
#     total_classes = serializers.IntegerField()
#     total_students = serializers.IntegerField()
#     total_points = serializers.FloatField()
#     average_points = serializers.FloatField()
#     achievements = serializers.DictField(child=serializers.IntegerField())
