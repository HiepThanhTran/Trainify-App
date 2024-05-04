from rest_framework import viewsets

from schools import serializers as schools_serializers
from schools.models import Criterion


class CriterionViewSet(viewsets.ViewSet):
    queryset = Criterion.objects.filter(is_active=True)
    serializer_class = schools_serializers.CriterionSerializer
