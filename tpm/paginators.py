from rest_framework import pagination


class ActivityPagination(pagination.PageNumberPagination):
    page_size = 4


class MissingActivityReportPagination(pagination.PageNumberPagination):
    page_size = 4


class CommentPaginators(pagination.PageNumberPagination):
    page_size = 5
