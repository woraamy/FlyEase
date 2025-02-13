from ninja import Router, Query, Schema, NinjaAPI
from typing import Optional, List
from django.db.models import Q
from .schemaPayload import AirportSchema, FlightSchema
from .models import Flight
from django.utils import timezone
from django.shortcuts import get_object_or_404

api = NinjaAPI()

@api.get("/flights/", response=List[FlightSchema])
def list_available_flights(request):
    now = timezone.now()
    # Filter flights with available seats and departure time in the future
    flights = Flight.objects.filter(available_seats__gt=0, departure_time__gte=now)
    return flights


# Get a single flight by ID (for flight details page)
@api.get("/flights/{flight_id}", response=FlightSchema)
def get_flight_details(request, flight_id: int):
    flight = get_object_or_404(Flight, id=flight_id)
    return flight
