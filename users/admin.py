# from django.contrib import admin

from tpm.admin import my_admin_site
from .models import *

my_admin_site.register(User)
my_admin_site.register(Officer)
my_admin_site.register(Student)
