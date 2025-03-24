import { Router, Request, Response } from "express";
import { Flight } from "../entity/Flight";
import { FlightClassDetail } from "../entity/FlightClassDetail";
import { AppDataSource } from "../data-source";
import { MoreThan } from "typeorm";
import axios from "axios";
import { Airport } from "../entity/Airport";

const router = Router();
const flightRepo = AppDataSource.getRepository(Flight);
const flightClassRepo = AppDataSource.getRepository(FlightClassDetail);

// ✅ List Available Flights
router.get("/", async (req, res) => {
    const flights = await flightRepo.find({
        where: { available_seats: MoreThan(0)},
        relations: ["departure_airport", "arrival_airport", "class_details", "travel_classes"],
    });

    res.json(flights);
});

// ✅ Search Flights
router.get("/search", async (req, res) => {
    const { departure_airport_city, arrival_airport_city, departure_date, arrival_date, travel_class_name } = req.query;

    const query = flightRepo.createQueryBuilder("flight")
        .leftJoinAndSelect("flight.departure_airport", "departure_airport")
        .leftJoinAndSelect("flight.arrival_airport", "arrival_airport")
        .leftJoinAndSelect("flight.class_details", "class_details")
        .leftJoinAndSelect("class_details.travel_class", "travel_class");

    if (departure_airport_city) {
        query.andWhere("departure_airport.city ILIKE :departure_airport_city", { departure_airport_city: `%${departure_airport_city}%` });
    }

    if (arrival_airport_city) {
        query.andWhere("arrival_airport.city ILIKE :arrival_airport_city", { arrival_airport_city: `%${arrival_airport_city}%` });
    }

    if (departure_date) {
        const start = new Date(departure_date as string);
        const end = new Date(departure_date as string);
        end.setHours(23, 59, 59, 999);
        query.andWhere("flight.departureTime BETWEEN :start AND :end", { start, end });
    }

    if (arrival_date) {
        const start = new Date(arrival_date as string);
        const end = new Date(arrival_date as string);
        end.setHours(23, 59, 59, 999);
        query.andWhere("flight.arrivalTime BETWEEN :start AND :end", { start, end });
    }

    if (travel_class_name) {
        query.andWhere("class_details.name ILIKE :travel_class_name", { travel_class_name: `%${travel_class_name}%` });
    }

    const flights = await query.getMany();
    res.json(flights);});

// ✅ Get Flight by ID
router.get("/:flightId", async (req, res) => {
    try {
        const { flightId } = req.params;
        const flight = await flightRepo.findOne({
            where: { id: Number(flightId) },
            relations: ["departure_airport", "arrival_airport", "class_details", "travel_classes"],
        });

        if (!flight) {
            res.status(404).json({ message: "Flight not found" });
        }

        res.json(flight);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

interface RecommendationRequest {
    wants_extra_baggage: boolean;
    wants_preferred_seat: boolean;
    wants_in_flight_meals: boolean;
    num_passengers: number;
    length_of_stay: number;
}

router.post('/recommend', async (req, res) => {
    try {
        const requestData: RecommendationRequest = {
            wants_extra_baggage: req.body.wants_extra_baggage,
            wants_preferred_seat: req.body.wants_preferred_seat,
            wants_in_flight_meals: req.body.wants_in_flight_meals,
            num_passengers: req.body.num_passengers,
            length_of_stay: req.body.length_of_stay
        };

        const response = await axios.post(
            'http://localhost:5000/recommend/new_user',
            requestData
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error connecting to recommendation service:', error);
        res.json([]);
    }
});

router.get('/airport/:code', async (req: Request, res: Response) => {
    try {
        const airportRepository = AppDataSource.getRepository(Airport);
        const flightRepository = AppDataSource.getRepository(Flight);

        // Find the airport
        const airport = await airportRepository.findOne({
            where: { code: req.params.code.toUpperCase() }
        });

        if (!airport) {
            return res.json([]);
        }

        // Get current date for filtering future flights
        const currentDate = new Date();

        // Find flights using QueryBuilder with relations and conditions
        const flights = await flightRepository
            .createQueryBuilder('flight')
            .leftJoinAndSelect('flight.departure_airport', 'departure_airport')
            .leftJoinAndSelect('flight.arrival_airport', 'arrival_airport')
            .leftJoinAndSelect('flight.travel_classes', 'travel_classes')
            .leftJoinAndSelect('flight.class_details', 'class_details')
            .where([
                { departure_airport: airport },
                { arrival_airport: airport }
            ])
            .andWhere('flight.departure_time >= :currentDate', { currentDate })
            .andWhere('flight.available_seats > :minSeats', { minSeats: 0 })
            .orderBy('flight.departure_time', 'ASC')
            .getMany();

        // Transform the response to include only necessary data
        const transformedFlights = flights.map(flight => ({
            id: flight.id,
            flight_number: flight.flight_number,
            departure_airport: {
                code: flight.departure_airport.code,
                city: flight.departure_airport.city,
                country: flight.departure_airport.country
            },
            arrival_airport: {
                code: flight.arrival_airport.code,
                city: flight.arrival_airport.city,
                country: flight.arrival_airport.country
            },
            departure_time: flight.departure_time,
            arrival_time: flight.arrival_time,
            base_price: flight.base_price,
            available_seats: flight.available_seats,
            rating: flight.rating,
            featured_image: flight.featured_image,
            amenities: {
                wifi: flight.has_wifi,
                entertainment: flight.has_entertainment,
                meals: flight.has_meals
            },
            travel_classes: flight.travel_classes.map(tc => ({
                id: tc.id,
                name: tc.name,
                details: flight.class_details
                    .filter(cd => cd.travel_class.id === tc.id)
                    .map(cd => ({
                        price: cd.base_price,
                        available_seats: cd.available_seats
                    }))
            }))
        }));

        res.json(transformedFlights);
    } catch (error) {
        console.error('Error fetching flights:', error);
        res.json([]);
    }
});

// Additional useful endpoints

router.get('/search-detailed', async (req: Request, res: Response) => {
    try {
        const {
            departure_airport,
            arrival_airport,
            date,
            min_price,
            max_price
        } = req.query;

        const flightRepository = AppDataSource.getRepository(Flight);
        const queryBuilder = flightRepository
            .createQueryBuilder('flight')
            .leftJoinAndSelect('flight.departure_airport', 'departure_airport')
            .leftJoinAndSelect('flight.arrival_airport', 'arrival_airport')
            .leftJoinAndSelect('flight.travel_classes', 'travel_classes')
            .where('flight.available_seats > :minSeats', { minSeats: 0 });

        if (departure_airport) {
            queryBuilder.andWhere('departure_airport.code = :departure_airport', { departure_airport });
        }

        if (arrival_airport) {
            queryBuilder.andWhere('arrival_airport.code = :arrival_airport', { arrival_airport });
        }

        if (date) {
            const searchDate = new Date(date as string);
            const nextDay = new Date(searchDate);
            nextDay.setDate(nextDay.getDate() + 1);
            
            queryBuilder.andWhere('flight.departure_time BETWEEN :start AND :end', {
                start: searchDate,
                end: nextDay
            });
        }

        if (min_price) {
            queryBuilder.andWhere('flight.base_price >= :min_price', { min_price });
        }

        if (max_price) {
            queryBuilder.andWhere('flight.base_price <= :max_price', { max_price });
        }

        const flights = await queryBuilder
            .orderBy('flight.departure_time', 'ASC')
            .getMany();

        res.json(flights);
    } catch (error) {
        console.error('Error searching flights:', error);
        res.json([]);
    }
});



export default router;