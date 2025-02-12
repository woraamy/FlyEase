from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from datetime import datetime

class Airport(models.Model):
    code = models.CharField(max_length=3, unique=True)
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.code} - {self.city}"

class Aircraft(models.Model):
    model = models.CharField(max_length=100)
    registration_number = models.CharField(max_length=20, unique=True)
    total_seats = models.IntegerField()

    def __str__(self):
        return f"{self.model} ({self.registration_number})"

class Flight(models.Model):
    flight_number = models.CharField(max_length=10, unique=True)
    aircraft = models.ForeignKey(Aircraft, on_delete=models.PROTECT)
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

    class Meta:
        indexes = [
            models.Index(fields=['departure_time', 'arrival_time']),
            models.Index(fields=['flight_number']),
        ]

    def __str__(self):
        return f"{self.flight_number}: {self.departure_airport} to {self.arrival_airport}"

class Passenger(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    passport_number = models.CharField(max_length=20, unique=True)
    date_of_birth = models.DateField()
    nationality = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.passport_number})"

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