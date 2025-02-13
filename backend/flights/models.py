from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from datetime import datetime

class Airport(models.Model):
    code = models.CharField(max_length=3, unique=True)
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    image = models.URLField(max_length=500, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['city']),
            models.Index(fields=['code']),
        ]

    def __str__(self):
        return f"{self.code} - {self.city}"

class Aircraft(models.Model):
    model = models.CharField(max_length=100)
    registration_number = models.CharField(max_length=20, unique=True)
    total_seats = models.IntegerField()
    
    def __str__(self):
        return f"{self.model} ({self.registration_number})"

class TripType(models.Model):
    TRIP_TYPES = (
        ('SOLO', 'Solo'),
        ('ROUND_TRIP', 'Round Trip'),
        ('MULTI_CITY', 'Multi City'),
    )

    name = models.CharField(max_length=20, choices=TRIP_TYPES, unique=True)

    def __str__(self):
        return self.get_name_display()
    
class TravelClass(models.Model):
    CLASS_TYPES = (
        ('ECONOMY', 'Economy'),
        ('BUSINESS', 'Business'),
        ('FIRST', 'First Class'),
    )

    name = models.CharField(max_length=20, choices=CLASS_TYPES, unique=True)
    price_multiplier = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(1.0)]
    )

    def __str__(self):
        return self.get_name_display()

class Flight(models.Model):
    flight_number = models.CharField(max_length=10, unique=True)
    departure_airport = models.ForeignKey(
        Airport,
        related_name='departures',
        on_delete=models.PROTECT
    )

    arrival_airport = models.ForeignKey(
        Airport,
        related_name='arrivals',
        on_delete=models.PROTECT
    )
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    available_seats = models.IntegerField()
    rating = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        default=0
    )
    featured_image = models.URLField(max_length=500, blank=True)

    duration = models.DurationField(null=True)
    has_wifi = models.BooleanField(default=False)
    has_entertainment = models.BooleanField(default=False)
    has_meals = models.BooleanField(default=False)
    travel_classes = models.ManyToManyField(
        TravelClass,
        through='FlightClass'
    )

    class Meta:
        indexes = [
            models.Index(fields=['departure_time']),
            models.Index(fields=['flight_number']),
            models.Index(fields=['base_price']),
            models.Index(fields=['rating']),
        ]

    def __str__(self):
        return f"{self.flight_number}: {self.departure_airport} to {self.arrival_airport}"

class FlightClass(models.Model):
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE)
    travel_class = models.ForeignKey(TravelClass, on_delete=models.PROTECT)
    available_seats = models.IntegerField(validators=[MinValueValidator(0)])

    class Meta:
        unique_together = ['flight', 'travel_class']

class Passenger(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    passport_number = models.CharField(max_length=20, unique=True)
    date_of_birth = models.DateField()
    nationality = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.passport_number})"

class Trip(models.Model):
    trip_type = models.ForeignKey(TripType, on_delete=models.PROTECT)
    passenger = models.ForeignKey(Passenger, on_delete=models.PROTECT)
    travel_class = models.ForeignKey(TravelClass, on_delete=models.PROTECT)

    # Passenger counts
    adults = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(9)]
    )
    children = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(9)],
        default=0
    )
    infants = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(1)],
        default=0
    )

    def clean(self):
        # Validate total passengers
        total_passengers = self.adults + self.children + self.infants
        if total_passengers > 9:
            raise ValidationError('Total number of passengers cannot exceed 9')

        # Validate infants count
        if self.infants > 1:
            raise ValidationError('Maximum number of infants allowed is 1')

        # Ensure there's at least one adult
        if self.adults < 1:
            raise ValidationError('At least one adult is required')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

class TripFlight(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='trip_flights')
    flight = models.ForeignKey(Flight, on_delete=models.PROTECT)
    sequence = models.PositiveIntegerField()  # For ordering flights in multi-city trips

    class Meta:
        unique_together = ['trip', 'sequence']
        ordering = ['sequence']

class Booking(models.Model):
    BOOKING_STATUS = (
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
    )

    booking_reference = models.CharField(max_length=10, unique=True)
    passenger = models.ForeignKey(Passenger, on_delete=models.PROTECT)
    flight = models.ForeignKey(Flight, on_delete=models.PROTECT)
    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10,
        choices=BOOKING_STATUS,
        default='PENDING'
    )
    seat_number = models.CharField(max_length=5)
    price_paid = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        indexes = [
            models.Index(fields=['booking_reference']),
            models.Index(fields=['booking_date']),
        ]

    def __str__(self):
        return f"{self.booking_reference} - {self.passenger}"

class Payment(models.Model):
    PAYMENT_STATUS = (
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    )

    booking = models.OneToOneField(Booking, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10,
        choices=PAYMENT_STATUS,
        default='PENDING'
    )
    transaction_id = models.CharField(max_length=100, unique=True)

    class Meta:
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['payment_date']),
        ]

    def __str__(self):
        return f"{self.transaction_id} - {self.booking.booking_reference}"
    
class Review(models.Model):
    flight = models.ForeignKey(Flight, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['flight', 'user']
        indexes = [
            models.Index(fields=['rating']),
        ]
