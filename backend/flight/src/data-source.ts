import "reflect-metadata"
import { DataSource } from "typeorm"
import * as path from "path";
import "dotenv/config";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_b7Is9ZMiwlhK@ep-withered-king-a1m6tgbk-pooler.ap-southeast-1.aws.neon.tech/test?sslmode=require',
    synchronize: true,
    logging: false,
    entities: [path.join(__dirname, "entity", "**", "*.{ts,js}")],
    migrations: [],
    subscribers: [],
})
