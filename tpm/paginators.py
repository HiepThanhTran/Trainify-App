from rest_framework import pagination


class ActivityPagination(pagination.PageNumberPagination):
    page_size = 5


class MissingActivityReportPagination(pagination.PageNumberPagination):
    page_size = 5


class StudentPagination(pagination.PageNumberPagination):
    page_size = 5


class CommentPaginators(pagination.PageNumberPagination):
    page_size = 5
