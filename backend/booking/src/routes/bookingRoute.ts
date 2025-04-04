import express from 'express';
import { AppDataSource } from '../data-source';
import { Booking, BookingStatus } from '../entity/Booking';
import { GenderStatus, Passenger } from '../entity/Passenger';


const router = express.Router();
const bookingRepo = AppDataSource.getRepository(Booking);
const passengerRepo = AppDataSource.getRepository(Passenger);

router.post('/success', async (req, res) => {
    const { paymentIntent } = req.body;
    const {
        booking_id,
        passport_number,
        first_name,
        last_name,
        email,
        contact_number,
        clerkUserId,
        nationality,
        gender,
        age,
        // Add the extra service metadata
        selectedMeal,
        selectedService,
        selectedBaggage
    } = paymentIntent;

    // Check if all required fields are present
    if  (
        !booking_id || !passport_number || !first_name || !last_name || !email || 
        !contact_number || !clerkUserId || nationality || gender || age
        ) 
     {
        // console.log('validation error: ', paymentIntent);
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    try {
        // Check if the person info exists in the database
        var passenger = await passengerRepo.findOne({
            where: { passport: passport_number },
            select: ['id'],
        })
        
        // if the person does not exist, create a new passenger
        if (!passenger) {
            passenger = passengerRepo.create({
                first_name: first_name,
                last_name: last_name,
                email: email,
                phone: contact_number,
                passport: passport_number,
                nationality: nationality,
                age: age,
                Gender: GenderStatus[gender]
            });
            await passengerRepo.save(passenger);
        }

        // Generate a unique booking code
        const booking_code = Math.random().toString(36).substr(2, 6).toUpperCase();

        // Update the booking with the passenger ID and status
        bookingRepo.update({ id: booking_id }, {
            passenger: passenger.id,
            status: BookingStatus.CONFIRMED,
            clerkId: clerkUserId,
            booking_code: booking_code,
            // Add the extra service data
            selected_meal: selectedMeal,
            selected_service: selectedService,
            selected_baggage: selectedBaggage
        });

        res.status(200).json({
            message: 'Booking confirmed successfully',
            booking_code: booking_code,
            passenger_id: passenger.id,
            booking_id: booking_id,
        });

    } catch (error) {
        // console.log('Error fetching passenger:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/decline', async (req, res) => {
    const { booking_id } = req.body;

    // Check if all required fields are present
    if (!booking_id) {
        res.status(400).json({ message: 'Booking ID is required' });
        return;
    }

    try {
        // attempt to delete the booking
        await bookingRepo.delete({ id: booking_id });
        res.status(200).json({ message: 'Booking declined successfully' });
        return;

    } catch (error) {

        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;

        }
    }
);

router.get('/check/:seatId/:flight/:seatClass', async (req, res) => {
    const { seatId, seatClass, flight } = req.params;
    
    // check if all required fields are present
    if (!seatId || !flight || !seatClass) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    // find the booking with the given seat ID, flight number, and seat class
    const booking = await bookingRepo.findOne({
        where: { seat_id: seatId, seat_class: seatClass, flight_number: flight },
    });

    if (booking) {
        // Seat is already booked
        res.status(409).json({ message: `Seat ${seatId} is already booked` });
        return;
    }
    try {
        // create temporary booking
        const newPost = bookingRepo.create({
            seat_id: seatId,
            seat_class: seatClass,
            flight_number: flight,
        });

        await bookingRepo.save(newPost);

        res.status(201).json({ booking_id: newPost.id });
        return;
    } catch (error) {
        // console.error('Error creating booking:', error);
        res.status(409).json({ message: 'Cannot make reservation' });
        return;
    }
    
});

// GET method to see reserved seats in a flight
router.get('/reserved-seats/:flight_number', async (req, res) => {
    const { flight_number } = req.params;

    if (!flight_number) {
        res.status(400).json({ message: 'Flight Number is required' });
        return;
    }

    // Filter reserved seats for the given flight ID
    const seats = await bookingRepo.find({
        where: { flight_number: flight_number },
        select: ['seat_id'],
        });

    if (seats.length === 0) {
        res.status(200).json({});  // No reserved seats
        return;
    }
    // Extract seat IDs from the bookings
    const seatIds = seats.map((booking) => booking.seat_id);
    res.status(200).json(seatIds);
});

//POST method to see reserved seats in a flight
router.post('/mybook', async (req, res) => {
    const { clerkUserId } = req.body;
    
    if (!clerkUserId) {
        res.status(400).json({ message: 'Clerk User ID is required' });
        return;
    }

    // Filter bookings for the given clerk ID
    const bookings = await bookingRepo.find({
        where: { clerkId: clerkUserId },
        relations: ['passenger'],
    });

    // Check if bookings exist
    if (bookings.length === 0) {
        res.status(404).json({ message: 'No bookings found' });
        return;
    }
    
    res.status(200).json(bookings);
    return;
});

export default router;