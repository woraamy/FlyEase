import "reflect-metadata"
import { DataSource } from "typeorm"
import * as path from "path";
import "dotenv/config";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [path.join(__dirname, "entity", "**", "*.{ts,js}")],
    migrations: [],
    subscribers: [],
})
