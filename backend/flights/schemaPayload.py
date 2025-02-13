from django.utils import timezone
from typing import List
from ninja import Schema

class AirportSchema(Schema):
    code: str
    name: str
    city: str
    country: str
    image: str = None

    class Config:
        orm_mode = True

# Schema for representing a Flight in responses.
class FlightSchema(Schema):
    flight_number: str
    departure_airport: AirportSchema
    arrival_airport: AirportSchema
    departure_time: timezone.datetime
    arrival_time: timezone.datetime
    base_price: float
    available_seats: int
    rating: float
    featured_image: str = None
    has_wifi: bool
    has_entertainment: bool
    has_meals: bool

    class Config:
        orm_mode = True