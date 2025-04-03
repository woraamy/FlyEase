import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { AircraftWarehouse } from '../entity/AircraftWarehouse';
import { Aircraft } from '../entity/Aircraft';

const router = Router();
const aircraftRepo = AppDataSource.getRepository(Aircraft);
const aircraftWarehouseRepo = AppDataSource.getRepository(AircraftWarehouse);

//Get Aircraft-layout
router.get('/layout/:flight_number', async (req, res) => {
    try {
        const { flight_number } = req.params;
        console.log(flight_number);
        const aircraft = await aircraftWarehouseRepo.find({
            relations: {
                aircraft: {
                    classes: true,  // Make sure to include all related classes
                }
            },
            select:{
                // id: true,
                flightNumber: true,
                aircraft: {
                    // id: true,
                    model_name: true,
                    classes: {
                        // id: true,
                        travel_class: true,
                        total_rows: true,
                        total_columns: true,
                    }
                }
            },
            where: { flightNumber: flight_number },
        });

        if (!aircraft) {
            res.status(404).json({ message: 'Aircraft not found' });
        }

        res.json(aircraft);
    } catch (error) {
        console.error('Error fetching aircraft layout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

export default router;