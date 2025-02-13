from django.urls import path
from ninja import NinjaAPI
from .api import router
# from . import api

app_name = 'flights'
api = NinjaAPI()
api.add_router("", router)

urlpatterns = [
    path("api/", api.urls),
]