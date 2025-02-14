from django.utils import timezone
from typing import List, Optional
from ninja import NinjaAPI
from .models import Flight
from .schemaPayload import FlightSchema, FlightClassDetailSchema, TravelClassSchema
from datetime import datetime

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

@api.get("/search/", response=List[FlightSchema])
def search_flights(
    request,
    departure_airport_city: Optional[str] = None,
    arrival_airport_city: Optional[str] = None,
    departure_date: Optional[str] = None,  # Changed from departure_time to departure_date
    arrival_date: Optional[str] = None,    # Changed from arrival_time to arrival_date
    travel_class_name: Optional[str] = None
):
    flights = Flight.objects.all()

    if departure_airport_city:
        flights = flights.filter(departure_airport__city__iexact=departure_airport_city)

    if arrival_airport_city:
        flights = flights.filter(arrival_airport__city__iexact=arrival_airport_city)

    if departure_date:
        try:
            # Convert string to datetime
            departure_date = datetime.strptime(departure_date, '%Y-%m-%d')
            # Create start and end of the day
            departure_start = timezone.make_aware(datetime.combine(departure_date, datetime.min.time()))
            departure_end = timezone.make_aware(datetime.combine(departure_date, datetime.max.time()))
            # Filter flights between start and end of the day
            flights = flights.filter(departure_time__range=(departure_start, departure_end))
        except ValueError:
            raise ValueError("Invalid departure date format. Use YYYY-MM-DD")

    if arrival_date:
        try:
            # Convert string to datetime
            arrival_date = datetime.strptime(arrival_date, '%Y-%m-%d')
            # Create start and end of the day
            arrival_start = timezone.make_aware(datetime.combine(arrival_date, datetime.min.time()))
            arrival_end = timezone.make_aware(datetime.combine(arrival_date, datetime.max.time()))
            # Filter flights between start and end of the day
            flights = flights.filter(arrival_time__range=(arrival_start, arrival_end))
        except ValueError:
            raise ValueError("Invalid arrival date format. Use YYYY-MM-DD")

    if travel_class_name:
        flights = flights.filter(travel_classes__name__iexact=travel_class_name).distinct()
    results = []
    for flight in flights:
        travel_details = [
            FlightClassDetailSchema(
                travel_class=TravelClassSchema.from_orm(detail.travel_class),
                available_seats=detail.available_seats,
            )
            for detail in flight.flightclassdetail_set.all()
        ]
        flight_data = {
            "id": flight.id,
            "flight_number": flight.flight_number,
            "departure_airport": {
                "code": flight.departure_airport.code,
                "name": flight.departure_airport.name,
                "city": flight.departure_airport.city,
                "country": flight.departure_airport.country,
                "image": flight.departure_airport.image,
            },
            "arrival_airport": {
                "code": flight.arrival_airport.code,
                "name": flight.arrival_airport.name,
                "city": flight.arrival_airport.city,
                "country": flight.arrival_airport.country,
                "image": flight.arrival_airport.image,
            },
            "departure_time": flight.departure_time,
            "arrival_time": flight.arrival_time,
            "base_price": float(flight.base_price),
            "available_seats": flight.available_seats,
            "rating": flight.rating,
            "featured_image": flight.featured_image,
            "has_wifi": flight.has_wifi,
            "has_entertainment": flight.has_entertainment,
            "has_meals": flight.has_meals,
            # The FlightSchema expects an alias "class_details" to be used in place of "travel_classes".
            "class_details": travel_details,
        }
        results.append(flight_data)

    return results