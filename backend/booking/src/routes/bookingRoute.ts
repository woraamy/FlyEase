import express from 'express';
import { AppDataSource } from '../data-source';
import { Booking, BookingStatus } from '../entity/Booking';
import { GenderStatus, Passenger } from '../entity/Passenger';


const router = express.Router();
const bookingRepo = AppDataSource.getRepository(Booking);
const passengerRepo = AppDataSource.getRepository(Passenger);

router.post('/success', async (req, res): Promise<void> => {
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
        age
    } = paymentIntent;


    if (!booking_id || !passport_number || !first_name || !last_name || !email || !contact_number) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }


    try {
        var passenger = await passengerRepo.findOne({
            where: { passport: passport_number },
            select: ['id'],
        })
        
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

        console.log(passenger);

        const booking_code = Math.random().toString(36).substr(2, 6).toUpperCase();

        bookingRepo.update({ id: booking_id }, {
            passenger_id: passenger.id,
            status: BookingStatus.CONFIRMED,
            clerkId: clerkUserId,
            booking_code: booking_code,
        });

        res.status(200).json({
            message: 'Booking confirmed successfully',
            booking_code: booking_code,
            passenger_id: passenger.id,
            booking_id: booking_id,
        });

    } catch (error) {
        console.log('Error fetching passenger:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/decline', async (req, res) => {
    const { booking_id } = req.body;

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
    // console.log(seatId, seatClass, flight);
    const booking = await bookingRepo.findOne({
        where: { seat_id: seatId, seat_class: seatClass, flight_number: flight },
    });

    if (booking) {
        res.status(409).json({ message: `Seat ${seatId} is already booked` });
        return;
    } else {
        try {
            const newPost = await bookingRepo.create({
                seat_id: seatId,
                seat_class: seatClass,
                flight_number: flight,
            });
            await bookingRepo.save(newPost);
            res.status(201).json({ booking_id : newPost.id });
            return;
        } catch (error) {
            console.error('Error fetching aircraft layout:', error);
            res.status(409).json({ message: 'Can not make reservation' });
            return;
    }
}});

// GET method to see reserved seats in a flight
router.get('/reserved-seats/:flightId', async (req, res) => {
    const { flightId } = req.params;
    // console.log(flightId);
    // Filter reserved seats for the given flight ID
    const seats = await bookingRepo.find({
        where: { flight_number: flightId },
        select: ['seat_id'],
        });

    res.status(200).json(seats);
});

//POST method to see reserved seats in a flight
router.post('/mybook', async (req, res) => {
    const { clerkUserId } = req.body;
    // console.log(clerkUserId);
    // Filter reserved seats for the given flight ID
    const bookings = await bookingRepo.find({
        where: { clerkId: clerkUserId },
        relations: ['passenger'],
    });

    if (bookings.length === 0) {
        res.status(404).json({ message: 'No bookings found' });
        return;
    }
    res.status(200).json(bookings);
});

export default router;