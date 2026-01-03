import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';

const app: Application = express();

app.use(cors({
    origin: env.CORS_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Expense Tracker API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

app.use('/api/v1', routes);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    });
});

const PORT = env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;