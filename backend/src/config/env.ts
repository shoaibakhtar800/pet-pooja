import dotenv from 'dotenv';

dotenv.config();

export const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
    APP_NAME: process.env.APP_NAME || 'Expense Tracker API',
    DATABASE_URL: process.env.DATABASE_URL || '',
};