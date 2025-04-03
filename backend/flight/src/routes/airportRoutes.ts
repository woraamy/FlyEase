import { Router } from 'express';
import { Airport } from '../entity/Airport';
import { AppDataSource } from '../data-source';

const router = Router();
const airportRepo = AppDataSource.getRepository(Airport);

router.get('/airports', async (req, res) => {
    try {
        const airportRepository = AppDataSource.getRepository(Airport);
        const airports = await airportRepository.find();
        res.json(airports);
    } catch (error) {
        console.error('Error fetching airports:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'An error occurred while fetching airports'
        });
    }
});

export default router;