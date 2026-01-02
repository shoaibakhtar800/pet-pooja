import { Router } from 'express';
import {
    getTopDaysExpenditure,
    getMonthlyPercentageChange,
    getPredictedExpenditure,
    getAllStatistics
} from '../controllers/statistics.controller';

const router = Router();

router.get('/', getAllStatistics);
router.get('/top-days', getTopDaysExpenditure);
router.get('/monthly-change', getMonthlyPercentageChange);
router.get('/prediction', getPredictedExpenditure);

export default router;

