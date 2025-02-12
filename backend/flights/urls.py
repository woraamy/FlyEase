from django.urls import path
from ninja import NinjaAPI

from . import views

app_name = 'flights'

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
]