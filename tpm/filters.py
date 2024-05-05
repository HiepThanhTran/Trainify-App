from django_filters import rest_framework as filters

from activities.models import DeficiencyReport


class DeficiencyReportFilter(filters.FilterSet):
    faculty = filters.CharFilter(field_name='activity__faculty__name', lookup_expr='icontains')

    class Meta:
        model = DeficiencyReport
        fields = ['faculty']
