import { Router } from 'express';
import { getAllUsers, getActiveUsers } from '../controllers/user.controller';

const router = Router();

router.get('/', getAllUsers);
router.get('/active', getActiveUsers);

export default router;

