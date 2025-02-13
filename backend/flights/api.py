from django.utils import timezone
from typing import List
from ninja import NinjaAPI
from .models import Flight
from .schemaPayload import FlightSchema

api = NinjaAPI()

@api.get("/flights/", response=List[FlightSchema])
def list_available_flights(request):
    now = timezone.now()
    # Prefetch related flight class details (including travel_class) and airport data.
    flights = Flight.objects.filter(
        available_seats__gt=0, departure_time__gte=now
    ).prefetch_related(
        'flightclassdetail_set__travel_class', 'departure_airport', 'arrival_airport'
    )
    return flights

