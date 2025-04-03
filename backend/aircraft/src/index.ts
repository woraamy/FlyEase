import express from 'express';
import cors from "cors";
import { AppDataSource } from "./data-source";
import routeAPI from './routes/index';
import "reflect-metadata";


const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use(routeAPI)

if (!process.env.DATABASE_URL) {
    throw new Error("Env DATABASE_URL are Not Define");
}

if (!PORT) {
    throw new Error("Env PORT are Not Define");
}

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected successfully!");

        // Start server after DB connection
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.error("❌ Database connection error:", error));
