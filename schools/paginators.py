from rest_framework import pagination


class ActivityPagination(pagination.PageNumberPagination):
    page_size = 10
