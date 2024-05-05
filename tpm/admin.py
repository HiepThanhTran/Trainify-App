from django.contrib import admin
from django.contrib.auth.models import Permission, Group


class MyAdminSite(admin.AdminSite):
    site_title = 'TPM site admin'
    site_header = 'Training point management administration'
    index_title = 'TPM administration'

    # def get_urls(self):
    #     return [path('course-stats/', self.course_view)] + super().get_urls()
    #
    # def course_view(self, request):
    #     course_count = Course.objects.count()
    #     course_stats = (Course.objects
    #                     .annotate(lesson_count=Count('lessons'))
    #                     .values('id', 'subject', 'lesson_count'))
    #
    #     return TemplateResponse(request=request,
    #                             template='admin/course-stats.html',
    #                             context={
    #                                 'course_count': course_count,
    #                                 'course_stats': course_stats,
    #                             })


my_admin_site = MyAdminSite(name='Training Point Management')

my_admin_site.register(Group)
my_admin_site.register(Permission)
