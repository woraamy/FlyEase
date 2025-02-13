from ninja import Router, Query
from typing import List
from django.db.models import Q
from .schemaPayload import FlightListSchema, FlightClassSchema
from .models import Flight
from datetime import datetime

router = Router()

@router.get("/flights", response=List[FlightListSchema])
def get_all_flights(
    request,
    page: int = Query(1, gt=0),
    page_size: int = Query(10, gt=0, le=100),
    sort_by: str = Query("departure_time", enum=["departure_time", "arrival_time", "base_price", "rating"]),
    sort_order: str = Query("asc", enum=["asc", "desc"]),
    departure_city: str = None,
    arrival_city: str = None,
    departure_date: datetime = None,
    min_price: float = None,
    max_price: float = None,
    travel_class: str = None,
    has_wifi: bool = None,
    has_entertainment: bool = None,
    has_meals: bool = None
):
    """
    Get all flights with comprehensive filtering options
    """
    # Start with all flights
    queryset = Flight.objects.select_related(
        'departure_airport',
        'arrival_airport'
    ).prefetch_related(
        'travel_classes',
        'travel_classes__travel_class'
    )

    # Apply filters
    filters = Q()

    if departure_city:
        filters &= Q(departure_airport__city__icontains=departure_city)

    if arrival_city:
        filters &= Q(arrival_airport__city__icontains=arrival_city)

    if departure_date:
        filters &= Q(departure_time__date=departure_date)

    if min_price is not None:
        filters &= Q(base_price__gte=min_price)

    if max_price is not None:
        filters &= Q(base_price__lte=max_price)

    if travel_class:
        filters &= Q(travel_classes__travel_class__name=travel_class)

    if has_wifi is not None:
        filters &= Q(has_wifi=has_wifi)

    if has_entertainment is not None:
        filters &= Q(has_entertainment=has_entertainment)

    if has_meals is not None:
        filters &= Q(has_meals=has_meals)

    if filters:
        queryset = queryset.filter(filters)

    # Apply sorting
    sort_field = f"{'-' if sort_order == 'desc' else ''}{sort_by}"
    queryset = queryset.order_by(sort_field)

    # Apply pagination
    start = (page - 1) * page_size
    end = start + page_size

    # Ensure distinct results
    queryset = queryset.distinct()

    return queryset[start:end]

# Add an endpoint to get flight details by ID
@router.get("/flights/{flight_id}", response=FlightListSchema)
def get_flight_detail(request, flight_id: int):
    """
    Get detailed information about a specific flight
    """
    flight = Flight.objects.select_related(
        'departure_airport',
        'arrival_airport'
    ).prefetch_related(
        'travel_classes',
        'travel_classes__travel_class'
    ).get(id=flight_id)

    return flight

# Add an endpoint to get available travel classes for a flight
@router.get("/flights/{flight_id}/travel-classes", response=List[FlightClassSchema])
def get_flight_travel_classes(request, flight_id: int):
    """
    Get available travel classes for a specific flight
    """
    flight = Flight.objects.prefetch_related(
        'travel_classes',
        'travel_classes__travel_class'
    ).get(id=flight_id)

    return flight.travel_classes.all()