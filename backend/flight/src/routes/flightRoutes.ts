import { Router } from "express";
import { Flight } from "../entity/Flight";
import { FlightClassDetail } from "../entity/FlightClassDetail";
import { AppDataSource } from "../data-source";
import { MoreThan } from "typeorm";


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

export default router;