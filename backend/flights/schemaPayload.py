from datetime import date
from ninja import Schema
from typing import List, Optional
from datetime import datetime, timedelta

class AirportSchema(Schema):
    id: int
    code: str
    name: str
    city: str
    country: str
    image: Optional[str]

class TravelClassSchema(Schema):
    id: int
    name: str
    price_multiplier: float

class FlightClassSchema(Schema):
    travel_class: TravelClassSchema
    available_seats: int

class FlightListSchema(Schema):
    id: int
    flight_number: str
    departure_airport: AirportSchema
    arrival_airport: AirportSchema
    departure_time: datetime
    arrival_time: datetime
    base_price: float
    available_seats: int
    rating: float
    featured_image: Optional[str]
    duration: Optional[str] = None
    image: Optional[str] = None
    has_wifi: bool
    has_entertainment: bool
    has_meals: bool
    travel_classes: List[FlightClassSchema]

    class Config:
        orm_mode = True

    @staticmethod
    def resolve_duration(obj):
        if isinstance(obj.duration, timedelta):
            hours = obj.duration.seconds // 3600
            minutes = (obj.duration.seconds % 3600) // 60
            return f"{hours}h {minutes}m"
        return str(obj.duration) if obj.duration else None

class TripTypeSchema(Schema):
    id: int
    name: str

class PassengerCountSchema(Schema):
    adults: int
    children: int
    infants: int

class FlightSearchSchema(Schema):
    from_city: Optional[str] = None
    to_city: Optional[str] = None
    departure_date: Optional[datetime] = None
    return_date: Optional[datetime] = None
    trip_type: Optional[str] = None
    travel_class: Optional[str] = None
    passengers: PassengerCountSchema
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_rating: Optional[float] = None

class FlightSearchResponseSchema(Schema):
    outbound_flights: List[FlightListSchema]
    return_flights: Optional[List[FlightListSchema]] = None

# For creating/updating flights
class FlightCreateSchema(Schema):
    flight_number: str
    departure_airport_id: int
    arrival_airport_id: int
    departure_time: datetime
    arrival_time: datetime
    base_price: float
    available_seats: int
    featured_image: Optional[str]
    has_wifi: bool = False
    has_entertainment: bool = False
    has_meals: bool = False
    travel_class_ids: List[int]

# For reviews
class ReviewSchema(Schema):
    id: int
    rating: int
    comment: Optional[str]
    created_at: datetime
    user_id: int

# For bookings
class BookingCreateSchema(Schema):
    flight_id: int
    trip_type_id: int
    travel_class_id: int
    adults: int
    children: int = 0
    infants: int = 0

class BookingResponseSchema(Schema):
    booking_reference: str
    flight: FlightListSchema
    travel_class: TravelClassSchema
    price_paid: float
    status: str
    seat_number: str
    booking_date: datetime

# For payments
class PaymentSchema(Schema):
    id: int
    amount: float
    payment_date: datetime
    status: str
    transaction_id: str
    booking_reference: str