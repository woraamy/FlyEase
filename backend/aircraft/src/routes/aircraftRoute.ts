import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { AircraftWarehouse } from '../entity/AircraftWarehouse';

const router = Router();
const aircraftWarehouseRepo = AppDataSource.getRepository(AircraftWarehouse);

//Get Aircraft-layout
router.get('/layout/:flight_number', async (req, res) => {
    try {
        const { flight_number } = req.params;
        
        // Validate flight_number
        if (!flight_number) {
            res.status(400).json({ message: 'Flight number is required' });
            return;
        }

        // Fetch the aircraft layout from the database
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

        // Check if the aircraft layout was found
        if (!aircraft) {
            res.status(404).json({ message: 'Aircraft not found' });
            return;
        }

        const seatConfigMap = {
            first: { row_total: 0, column_total: 0 , start_row: 0 },
            business: { row_total: 0, column_total: 0 , start_row: 0 },
            economy: { row_total: 0, column_total: 0 , start_row: 0 }
          };

        // Map the classes to the seatConfigMap
        aircraft.forEach((aircraftItem) => {
            const classes = aircraftItem.aircraft.classes;
            classes.forEach((cls) => {
                const travelClass = cls.travel_class.toLowerCase();
                seatConfigMap[travelClass] = {
                    row_total: cls.total_rows,
                    column_total: cls.total_columns
                };
            });
        });

        // Calculate start_row for each class
        seatConfigMap.business.start_row = seatConfigMap.first.row_total + 1;
        seatConfigMap.economy.start_row = seatConfigMap.first.row_total + seatConfigMap.business.row_total + 1;
        seatConfigMap.first.start_row = 1;

        // success response
        res.status(200).json(seatConfigMap);
    } catch (error) {
        console.error('Error fetching aircraft layout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

    return;
});

export default router;