import express from "express";
import { AppDataSource } from "./data-source"
import cors from "cors";
import routeAPI from './routes/index'
import "reflect-metadata";
// import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());
app.use(routeAPI)
const PORT = process.env.PORT;

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
