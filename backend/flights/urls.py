from django.urls import path
from ninja import NinjaAPI

from . import api

app_name = 'flights'


urlpatterns = [
    path("api/", api.api.urls),
]