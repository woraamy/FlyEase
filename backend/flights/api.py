from ninja import Router, Query, Schema, NinjaAPI
from typing import Optional, List
from django.db.models import Q
from .schemaPayload import AirportSchema, FlightSchema
from .models import Flight
from django.utils import timezone

api = NinjaAPI()

@api.get("/flights/", response=List[FlightSchema])
def list_available_flights(request):
    now = timezone.now()
    # Filter flights with available seats and departure time in the future
    flights = Flight.objects.filter(available_seats__gt=0, departure_time__gte=now)
    return flights

