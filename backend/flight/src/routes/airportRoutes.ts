import { Router } from 'express';
import { Airport } from '../entity/Airport';
import { AppDataSource } from '../data-source';

const router = Router();
const airportRepo = AppDataSource.getRepository(Airport);

router.get('/airports', async (req, res) => {
    try {
        const airports = await airportRepo.find();
        res.json(airports);
    } catch (error) {
        console.error('Error fetching airports:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'An error occurred while fetching airports'
        });
    }
    return
});

export default router;