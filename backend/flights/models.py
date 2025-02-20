from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

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

class Flight(models.Model):
    flight_number = models.CharField(max_length=10, unique=True)
    departure_airport = models.ForeignKey(
        Airport, related_name='departures', on_delete=models.PROTECT
    )
    arrival_airport = models.ForeignKey(
        Airport, related_name='arrivals', on_delete=models.PROTECT
    )
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    base_price = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
    available_seats = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    rating = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)], default=0)
    featured_image = models.URLField(max_length=500, blank=True)
    has_wifi = models.BooleanField(default=False)
    has_entertainment = models.BooleanField(default=False)
    has_meals = models.BooleanField(default=False)

    travel_classes = models.ManyToManyField("TravelClass", through="FlightClassDetail")

    class Meta:
        indexes = [
            models.Index(fields=['departure_time']),
            models.Index(fields=['flight_number']),
            models.Index(fields=['base_price']),
            models.Index(fields=['rating']),
        ]

    @property
    def class_details(self):
        return list(self.flightclassdetail_set.all())

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
    status = models.CharField(max_length=10, choices=BOOKING_STATUS, default='PENDING')
    seat_number = models.CharField(max_length=5)
    price_paid = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        indexes = [
            models.Index(fields=['booking_reference']),
            models.Index(fields=['booking_date']),
        ]

    def __str__(self):
        return f"{self.booking_reference} - {self.passenger}"

class TravelClass(models.Model):
    CLASS_CHOICES = (
        ('ECONOMY', 'Economy'),
        ('BUSINESS', 'Business'),
        ('FIRST', 'First Class'),
    )
    name = models.CharField(max_length=20, choices=CLASS_CHOICES, unique=True)

    price_multiplier = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=1.00,
        validators=[MinValueValidator(1.0)]
    )

    def __str__(self):
        return dict(TravelClass.CLASS_CHOICES).get(self.name, self.name)


class FlightClassDetail(models.Model):
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE)
    travel_class = models.ForeignKey(TravelClass, on_delete=models.PROTECT)
    available_seats = models.PositiveIntegerField(validators=[MinValueValidator(0)])

    class Meta:
        unique_together = ['flight', 'travel_class']

    def __str__(self):
        return f"{self.flight.flight_number} - {self.travel_class}"