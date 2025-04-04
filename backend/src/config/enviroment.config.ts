import dotenv from "dotenv";

dotenv.config();

const {
    PORT = 3000,
    JWT_SECRET = "",
    DB_CONNECTION_STRING = ""
} = process.env;

export const config = {
    PORT: Number(PORT),
    JWT_SECRET,
    DB_CONNECTION_STRING
};