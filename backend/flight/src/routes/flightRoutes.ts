import { Router, Request, Response } from "express";
import { Flight } from "../entity/Flight";
import { AppDataSource } from "../data-source";
import { MoreThan } from "typeorm";
import axios from "axios";

const RECOMMEND_URL = process.env.RECOMMEND_URL;
const AIRCRAFT_URL = process.env.AIRCRAFT_URL;
export const router = Router();
export const flightRepo = AppDataSource.getRepository(Flight);

// ✅ List Available Flights - FIXED
router.get("/", async (req, res) => {
    try {
        // Fetch all available flights
        const flights = await flightRepo.find({
            where: { available_seats: MoreThan(0)},
            relations: ["departure_airport", "arrival_airport", "class_details", "travel_classes"],
        });

        // Check if flights are available
        if (!flights || flights.length === 0) {
            res.status(404).json({ message: "No flights available" });
            return;
        }
        
        // success response
        res.status(200).json(flights);
        return;
    } catch (error) {
        // console.error('Error fetching flights:', error);
        res.status(500).json({ error: "Something went wrong" });
        return;
    }
});
// ✅ Search Flights - FIXED
router.get("/search", async (req, res) => {
    try {
        const { departure_airport_city, arrival_airport_city, departure_date, arrival_date, travel_class_name } = req.query;

        const query = flightRepo.createQueryBuilder("flight")
            .leftJoinAndSelect("flight.departure_airport", "departure_airport")
            .leftJoinAndSelect("flight.arrival_airport", "arrival_airport")

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
            // Fix: Use the correct column name with underscore
            query.andWhere("flight.departure_time BETWEEN :start AND :end", { start, end });
        }

        if (arrival_date) {
            const start = new Date(arrival_date as string);
            const end = new Date(arrival_date as string);
            end.setHours(23, 59, 59, 999);
            // Fix: Use the correct column name with underscore
            query.andWhere("flight.arrival_time BETWEEN :start AND :end", { start, end });
        }

        const flights = await query.getMany();

        var flightResult: any = [];
        
        if (!travel_class_name) {
            res.status(200).json(flights);
            return;
        } else {
            const data = await fetch(`${AIRCRAFT_URL}/aircraft/class-details`);
            const flightNumberMap = await data.json();
            // loop through the flights and check if the travel class is available
            for (const flight of flights) {
                const flightNumber = flight.flight_number;
                // check if the travel_class_name exists in the flightNumber
                const classes = flightNumberMap[flightNumber][travel_class_name];
                // if classes is true, then add the flight to the flights array
                if (classes) {
                    flightResult.push(flight);
                }
            }            
        }

        // success response
        res.status(200).json(flightResult);
        return;
    } catch (error) {
        console.error('Error searching flights:', error);
        res.status(500).json({ error: "Something went wrong" });
        return;
    }
});

// ✅ Get Flight by ID - FIXED
router.get("/:flightId", async (req, res) => {
    try {
        const { flightId } = req.params;
        const flight = await flightRepo.findOne({
            where: { id: Number(flightId) },
            relations: ["departure_airport", "arrival_airport", "class_details", "travel_classes"],
        });

        if (!flight) {
            res.status(404).json({ message: "Flight not found" });
            return;
        }

        // success response
        res.status(200).json(flight);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
    return;
});


// ✅ Get Flights by Arrival City - FIXED
router.get("/travel-rec/:arrivalCity", async (req, res) => {
    console.log("route hit")
    try {
      const { arrivalCity } = req.params;
      console.log(arrivalCity)
      if (!arrivalCity) {
        res.status(400).json({ error: "Arrival city is required" });
        return;
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
    return;
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
            `${RECOMMEND_URL}/recommend/new_user`,
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

        if (!code || (upperCode.length !== 3 && upperCode.length !== 4)) {
            res.status(400).json({ 
                error: 'Bad request',
                message: 'Invalid airport code format. Code must be 3 or 4 characters.'
            });
            return;
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
            return;
        }
        res.json(flights);
    } catch (error) {
        // console.error('Error fetching flights by airport code:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'An error occurred while fetching flights'
        });
    }

    return;
});


// Get Flight by Flight Number
router.get("/by-number/:flightNumber", async (req, res) => {
    try {
      const { flightNumber } = req.params;
      
      const flight = await flightRepo.findOne({
        where: { flight_number: flightNumber },
        relations: ["departure_airport", "arrival_airport", "class_details", "travel_classes"],
      });
  
      if (!flight) {
        res.status(404).json({ error: "Flight not found" });
        return;
      }
  
      res.json(flight);

    } catch (error) {

      console.error('Error fetching flight by number:', error);
      res.status(500).json({ error: "Something went wrong" });

    }

    return;
  });

export default router;