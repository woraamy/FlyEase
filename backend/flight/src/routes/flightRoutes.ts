import { Router } from "express";
import { Flight } from "../entity/Flight";
import { FlightClassDetail } from "../entity/FlightClassDetail";
import { AppDataSource } from "../data-source";
import { MoreThan } from "typeorm";


const router = Router();
const flightRepo = AppDataSource.getRepository(Flight);
const flightClassRepo = AppDataSource.getRepository(FlightClassDetail);

// ✅ Get Flight by ID
router.get("/:flightId", async (req, res) => {
    try {
        const { flightId } = req.params;
        
        const flight = await flightRepo.findOne({
            where: { id: Number(flightId) },
            relations: ["departureAirport", "arrivalAirport", "flightClassDetails", "flightClassDetails.travelClass"],
        });

        if (!flight) {
            res.status(404).json({ message: "Flight not found" });
        }

        res.json(flight);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ✅ List Available Flights
router.get("/", async (req, res) => {
    const flights = await flightRepo.find({
        where: { available_seats: MoreThan(0), departure_time: MoreThan(new Date()) },
        relations: ["departureAirport", "arrivalAirport", "flightClassDetails", "flightClassDetails.travelClass"],
    });

    res.json(flights);
});

// ✅ Search Flights
router.get("/search", async (req, res) => {
    const { departure_airport_city, arrival_airport_city, departure_date, arrival_date, travel_class_name } = req.query;

    let query = flightRepo.createQueryBuilder("flight")
        .leftJoinAndSelect("flight.departureAirport", "departureAirport")
        .leftJoinAndSelect("flight.arrivalAirport", "arrivalAirport")
        .leftJoinAndSelect("flight.flightClassDetails", "flightClassDetail")
        .leftJoinAndSelect("flightClassDetail.travelClass", "travelClass");

    if (departure_airport_city) {
        query = query.andWhere("departureAirport.city ILIKE :departure_airport_city", { departure_airport_city });
    }

    if (arrival_airport_city) {
        query = query.andWhere("arrivalAirport.city ILIKE :arrival_airport_city", { arrival_airport_city });
    }

    if (departure_date) {
        const start = new Date(departure_date as string);
        const end = new Date(departure_date as string);
        end.setHours(23, 59, 59, 999);

        query = query.andWhere("flight.departureTime BETWEEN :start AND :end", { start, end });
    }

    if (arrival_date) {
        const start = new Date(arrival_date as string);
        const end = new Date(arrival_date as string);
        end.setHours(23, 59, 59, 999);

        query = query.andWhere("flight.arrivalTime BETWEEN :start AND :end", { start, end });
    }

    if (travel_class_name) {
        query = query.andWhere("travelClass.name ILIKE :travel_class_name", { travel_class_name });
    }

    const flights = await query.getMany();
    res.json(flights);
});

export default router;
