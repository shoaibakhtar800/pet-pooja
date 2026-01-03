import dotenv from 'dotenv';

dotenv.config();

const parseCorOrigins = (origins: string | undefined): string[] => {
    if (!origins) {
        return ["http://localhost:3000", "http://127.0.0.1:3000"];
    }
    return origins.split(",").map((origin) => origin.trim());
};

export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4200,
    APP_NAME: process.env.APP_NAME || "Expense Tracker API",
    DATABASE_URL: process.env.DATABASE_URL || "",
    CORS_ORIGINS: parseCorOrigins(process.env.CORS_ORIGINS),
};