import { Router, Request, Response } from "express";
import { Flight } from "../entity/Flight";
import { AppDataSource } from "../data-source";
import { MoreThan } from "typeorm";
import axios from "axios";


const router = Router();
const flightRepo = AppDataSource.getRepository(Flight);

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


// ✅ Get Flights by Arrival City
router.get("/travel-rec/:arrivalCity", async (req, res) => {
    console.log("route hit")
    try {
      const { arrivalCity } = req.params;
      console.log(arrivalCity)
      if (!arrivalCity) {
        res.status(400).json({ error: "Arrival city is required" });
      }
      
      const flights = await flightRepo
        .createQueryBuilder("flight")
        .leftJoinAndSelect("flight.departure_airport", "departure_airport")
        .leftJoinAndSelect("flight.arrival_airport", "arrival_airport")
        .leftJoinAndSelect("flight.class_details", "class_details")
        .leftJoinAndSelect("flight.travel_classes", "travel_classes")
        .where("LOWER(arrival_airport.city) = LOWER(:arrival_city)", { arrival_city: arrivalCity })
        .getMany();
      
      console.log("Flights found:", flights); // Debug log
      console.log("hello world ")
      
      // Return empty array if no flights found (instead of 404 error)
      res.json(flights);
      
    } catch (error) {
      console.error('Error occurred:', error); // Log full error
      res.status(500).json({ error: "Something went wrong", details: error }); // Add 'details' for debugging
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
        // Format the request data according to what the Python service expects
        const requestData = {
            user_preferences: {
                wants_extra_baggage: req.body.wants_extra_baggage,
                wants_preferred_seat: req.body.wants_preferred_seat,
                wants_in_flight_meals: req.body.wants_in_flight_meals,
                num_passengers: req.body.num_passengers,
                length_of_stay: req.body.length_of_stay
            },
            season: req.body.season || 'Summer',
            trip_type: req.body.trip_type || 'Regular Vacation',
            origin: req.body.origin || null,
            top_k: req.body.top_k  || 10
        };

        // console.log('Sending recommendation request:', JSON.stringify(requestData));

        const response = await axios.post(
            'http://localhost:5001/recommend/new_user',
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error connecting to recommendation service:', error);
        // Return a more informative error response
        res.status(500).json({ 
            error: 'Failed to get recommendations',
            details: error.response ? error.response.data : error.message
        });
    }
});

// Additional useful endpoints
router.get('/by-airport/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const upperCode = code.toUpperCase(); // Convert to uppercase immediately

        // if (!code || upperCode.length !== 3 || ) {
        if (!code || (upperCode.length !== 3 && upperCode.length !== 4)) {
            res.status(400).json({ 
                error: 'Bad request',
                message: 'Invalid airport code format. Code must be 3 characters.'
            });
        }

        const flights = await flightRepo.createQueryBuilder('flight')
            .leftJoinAndSelect('flight.departure_airport', 'departure_airport')
            .leftJoinAndSelect('flight.arrival_airport', 'arrival_airport')
            .leftJoinAndSelect('flight.travel_classes', 'travel_classes')
            .leftJoinAndSelect('flight.class_details', 'class_details')
            .where('UPPER(departure_airport.code) = :code OR UPPER(arrival_airport.code) = :code', { code: upperCode })
            .getMany();

        if (flights.length === 0) {
            res.status(404).json({
                message: `No flights found for airport code ${upperCode}`
            });
        }

        res.json(flights);
    } catch (error) {
        console.error('Error fetching flights by airport code:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'An error occurred while fetching flights'
        });
    }
});



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