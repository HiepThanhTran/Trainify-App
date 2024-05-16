from django_filters import rest_framework as filters


class MyFilter(filters.FilterSet):
    class Meta:
        model = None
        fields = '__all__'