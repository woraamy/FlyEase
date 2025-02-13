# schemas.py (or schemaPayload.py)
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
    # Here we alias the schema field name "travel_classes" to the Flight model's "class_details" property.
    travel_classes: List[FlightClassDetailSchema] = Field(..., alias="class_details")

    class Config:
        from_attributes = True