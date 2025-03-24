from typing import List, Optional
from datetime import datetime
from ninja import Schema, ModelSchema
from pydantic import Field
from .models import Airport

class AirportSchema(Schema):
    id: int
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



# class AirportSchema(Schema):
#     id: str
#     code: str
#     name: str
#     city: str
#     country: str
#     image: str

class FlightRecommendationSchema(Schema):
    id: str
    flight_number: str
    departure_time: datetime
    arrival_time: datetime
    base_price: str
    available_seats: int
    rating: float
    featured_image: str
    has_wifi: bool
    has_entertainment: bool
    has_meals: bool
    arrival_airport_id: str
    departure_airport_id: str

class RecommendationRequestSchema(Schema):
    wants_extra_baggage: int
    wants_preferred_seat: int
    wants_in_flight_meals: int
    num_passengers: int
    length_of_stay: int

class RecommendedDestinationSchema(Schema):
    avg_rating: float
    booking_count: int
    destination: str
    popularity_score: float
    score: float