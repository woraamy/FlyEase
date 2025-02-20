from typing import List, Optional
from datetime import datetime
from ninja import Schema
from pydantic import Field

class AirportSchema(Schema):
    code: str
    name: str
    city: str
    country: str
    image: Optional[str] = None

    class Config:
        from_attributes = True

class TravelClassSchema(Schema):
    name: str
    price_multiplier: float

    class Config:
        from_attributes = True

class FlightClassDetailSchema(Schema):
    travel_class: TravelClassSchema
    available_seats: int

    class Config:
        from_attributes = True

class FlightSchema(Schema):
    id: int
    flight_number: str
    departure_airport: AirportSchema
    arrival_airport: AirportSchema
    departure_time: datetime
    arrival_time: datetime
    base_price: float
    available_seats: int
    rating: float
    featured_image: Optional[str] = None
    has_wifi: bool
    has_entertainment: bool
    has_meals: bool
    # Here we alias the field "travel_classes" to pull data from Flight.class_details
    travel_classes: List[FlightClassDetailSchema] = Field(default_factory=list, alias="class_details")

    class Config:
        from_attributes = True
        extra = "ignore"