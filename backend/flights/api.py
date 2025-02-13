from ninja import NinjaAPI, Schema
from typing import List, Optional
from datetime import datetime
from .models import Flight, Airport, Review
from django.db.models import Avg
from .schemaPayload import AirportSchema, FlightListSchema
from django.utils import timezone

api = NinjaAPI()

@api.get("/flights", response=List[FlightListSchema])
def list_flights(
    request,
    from_city: Optional[str] = None,
    to_city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None
):
    queryset = Flight.objects.select_related(
        'departure_airport',
        'arrival_airport'
    ).filter(
        departure_time__gte=timezone.now()
    )

    if from_city:
        queryset = queryset.filter(
            departure_airport__city__icontains=from_city
        )

    if to_city:
        queryset = queryset.filter(
            arrival_airport__city__icontains=to_city
        )

    if min_price is not None:
        queryset = queryset.filter(base_price__gte=min_price)

    if max_price is not None:
        queryset = queryset.filter(base_price__lte=max_price)

    if min_rating is not None:
        queryset = queryset.filter(rating__gte=min_rating)

    # Convert the queryset to a list of dictionaries with proper formatting
    flights_list = []
    for flight in queryset:
        flight_dict = {
            'id': flight.id,
            'flight_number': flight.flight_number,
            'departure_airport': flight.departure_airport,
            'arrival_airport': flight.arrival_airport,
            'departure_time': flight.departure_time,
            'arrival_time': flight.arrival_time,
            'base_price': float(flight.base_price),
            'available_seats': flight.available_seats,
            'rating': float(flight.rating),
            'featured_image': flight.featured_image,
            'duration': str(flight.duration) if flight.duration else None,
            'image': flight.featured_image
        }
        flights_list.append(flight_dict)

    return flights_list
