import express from 'express';
import { AppDataSource } from '../data-source';
import { Booking } from '../entity/Booking';


const router = express.Router();
const bookingRepo = AppDataSource.getRepository(Booking);

// GET method to see reserved seats in a flight
router.get('/reserved-seats/:flightId', async (req, res) => {
    const { flightId } = req.params;
    console.log(flightId);
    // Filter reserved seats for the given flight ID
    const seats = await bookingRepo.find({
        where: { flight_number: flightId },
        select: ['seat_number'],
        });

    res.status(200).json(seats);
});

export default router;