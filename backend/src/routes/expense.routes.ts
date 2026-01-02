import { Router } from 'express';
import {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense
} from '../controllers/expense.controller';
import {
    createExpenseValidator,
    updateExpenseValidator,
    deleteExpenseValidator,
    getExpenseByIdValidator,
    filterExpensesValidator
} from '../validators/expense.validator';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', filterExpensesValidator, validate, getAllExpenses);
router.get('/:id', getExpenseByIdValidator, validate, getExpenseById);
router.post('/', createExpenseValidator, validate, createExpense);
router.put('/:id', updateExpenseValidator, validate, updateExpense);
router.delete('/:id', deleteExpenseValidator, validate, deleteExpense);

export default router;

