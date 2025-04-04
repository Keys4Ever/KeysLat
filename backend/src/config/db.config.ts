import { DataSource } from "typeorm";
import "reflect-metadata";
import { config } from "./enviroment.config";

const { DB_CONNECTION_STRING } = config;

console.log(DB_CONNECTION_STRING);

export const AppDataSource = new DataSource({
    type: "postgres",
    url: DB_CONNECTION_STRING,
    synchronize: true,
    logging: false,
    entities: ["src/entities/*.ts"],
    migrations: ["src/migrations/*.ts"],
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});

