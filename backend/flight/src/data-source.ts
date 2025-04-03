import "dotenv/config"; // Add this at the top
import { DataSource } from "typeorm";
import { Airport } from "./entity/Airport";
import { Flight } from "./entity/Flight";
import { TravelClass } from "./entity/TravelClass";
import { FlightClassDetail } from "./entity/FlightClassDetail";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [Airport, Flight, TravelClass, FlightClassDetail],
    migrations: [],
    subscribers: [],
});