from django_filters import rest_framework as filters

from activities.models import MissingActivityReport


class MissingActivityReportFilter(filters.FilterSet):
    faculty = filters.CharFilter(field_name='activity__faculty__name', lookup_expr='icontains')

    class Meta:
        model = MissingActivityReport
        fields = ['faculty']
