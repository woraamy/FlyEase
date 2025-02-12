from datetime import date
from ninja import Schema
from typing import List, Optional
from datetime import datetime

class AirportSchema(Schema):
    id: int
    code: str
    name: str
    city: str
    country: str
    image: Optional[str] = None

class FlightListSchema(Schema):
    id : int
    flight_number: str
    departure_airport: AirportSchema
    arrival_airport: AirportSchema
    departure_time: datetime
    arrival_time: datetime
    base_price: float
    available_seats: int
    rating: float
    featured_image: Optional[str] = None
    duration: Optional[str] = None
    image: Optional[str] = None  # Make image field optional with None as default