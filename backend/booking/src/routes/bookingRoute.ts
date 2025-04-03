import express from 'express';
import { AppDataSource } from '../data-source';
import { Booking, BookingStatus } from '../entity/Booking';
import { Passenger } from '../entity/Passenger';


const router = express.Router();
const bookingRepo = AppDataSource.getRepository(Booking);
const passengerRepo = AppDataSource.getRepository(Passenger);

router.post('/success', async (req, res) => {
    const { booking_id,
            id_card, passport,
            first_name,
            last_name,
            email,
            phone,
            clerkId,
             } = req.body;

    if (!booking_id) {
        res.status(400).json({ message: 'Booking ID is required' });
    }

    if (!id_card && !passport) {
        res.status(400).json({ message: 'ID card or passport is required' });
    }

    try {
        var passenger = await passengerRepo.createQueryBuilder('passenger')
            .where('passenger.id_card = :id_card', {id_card})
            .orWhere('passenger.passport = :passport', {passport})
            .getOne();

        if (!passenger) {
            passenger = passengerRepo.create({
                first_name: first_name,
                last_name: last_name,
                email: email,
                phone: phone,
                id_card: id_card,
                passport: passport,
            });

            await passengerRepo.save(passenger);
        }

        const booking_code = Math.random().toString(36).substr(2, 6).toUpperCase();

        bookingRepo.update({ id: booking_id }, {
            passenger_id: passenger.id,
            status: BookingStatus.CONFIRMED,
            clerkId: clerkId,
            booking_code: booking_code,
        });

        res.status(200).json({
            message: 'Booking confirmed successfully',
            booking_code: booking_code,
            passenger_id: passenger.id,
            booking_id: booking_id,
        });

    } catch (error) {
        console.error('Error fetching passenger:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/decline', async (req, res) => {
    const { booking_id } = req.body;

    if (!booking_id) {
        res.status(400).json({ message: 'Booking ID is required' });
    }

    try {
        // attempt to delete the booking
        await bookingRepo.delete({ id: booking_id });
        res.status(200).json({ message: 'Booking declined successfully' });

    } catch (error) {

        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Internal server error' });

        }
    }
);

router.get('/check/:seatId/:flight/:seatClass', async (req, res) => {
    const { seatId, seatClass, flight } = req.params;
    console.log(seatId, seatClass, flight);
    const booking = await bookingRepo.findOne({
        where: { seat_id: seatId, seat_class: seatClass, flight_number: flight },
    });

    if (booking) {
        res.status(409).json({ message: `Seat ${seatId} is already booked` });
    } else {
        try {
            const newPost = await bookingRepo.create({
                seat_id: seatId,
                seat_class: seatClass,
                flight_number: flight,
            });
            await bookingRepo.save(newPost);
            res.status(201).json({ booking_id : newPost.id });
        } catch (error) {
            console.error('Error fetching aircraft layout:', error);
            res.status(409).json({ message: 'Can not make reservation' });
    }
}});

// GET method to see reserved seats in a flight
router.get('/reserved-seats/:flightId', async (req, res) => {
    const { flightId } = req.params;
    console.log(flightId);
    // Filter reserved seats for the given flight ID
    const seats = await bookingRepo.find({
        where: { flight_number: flightId },
        select: ['seat_id'],
        });

    res.status(200).json(seats);
});

export default router;