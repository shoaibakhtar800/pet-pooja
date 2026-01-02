import { body, param, query } from 'express-validator';

export const createExpenseValidator = [
    body('user_id')
        .notEmpty().withMessage('User ID is required')
        .isInt({ min: 1 }).withMessage('User ID must be a positive integer'),

    body('category_id')
        .notEmpty().withMessage('Category ID is required')
        .isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),

    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),

    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format (YYYY-MM-DD)'),

    body('description')
        .optional()
        .isString().withMessage('Description must be a string')
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

export const updateExpenseValidator = [
    param('id')
        .isInt({ min: 1 }).withMessage('Expense ID must be a positive integer'),

    body('user_id')
        .optional()
        .isInt({ min: 1 }).withMessage('User ID must be a positive integer'),

    body('category_id')
        .optional()
        .isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),

    body('amount')
        .optional()
        .isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),

    body('date')
        .optional()
        .isISO8601().withMessage('Date must be a valid date format (YYYY-MM-DD)'),

    body('description')
        .optional()
        .isString().withMessage('Description must be a string')
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

export const deleteExpenseValidator = [
    param('id')
        .isInt({ min: 1 }).withMessage('Expense ID must be a positive integer'),
];

export const getExpenseByIdValidator = [
    param('id')
        .isInt({ min: 1 }).withMessage('Expense ID must be a positive integer'),
];

export const filterExpensesValidator = [
    query('user_id')
        .optional()
        .isInt({ min: 1 }).withMessage('User ID must be a positive integer'),

    query('category_id')
        .optional()
        .isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),

    query('start_date')
        .optional()
        .isISO8601().withMessage('Start date must be a valid date format (YYYY-MM-DD)'),

    query('end_date')
        .optional()
        .isISO8601().withMessage('End date must be a valid date format (YYYY-MM-DD)'),
];

