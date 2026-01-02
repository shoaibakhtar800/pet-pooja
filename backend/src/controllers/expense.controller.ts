import { Request, Response } from 'express';
import { query } from '../config/database';
import { ExpenseWithDetails, CreateExpenseDTO, UpdateExpenseDTO, ApiResponse, ExpenseFilters } from '../types';

export const getAllExpenses = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
        const offset = (page - 1) * limit;

        const filters: ExpenseFilters = {
            user_id: req.query.user_id ? parseInt(req.query.user_id as string) : undefined,
            category_id: req.query.category_id ? parseInt(req.query.category_id as string) : undefined,
            start_date: req.query.start_date as string | undefined,
            end_date: req.query.end_date as string | undefined,
        };

        let whereClause = 'WHERE 1=1';
        const params: (string | number)[] = [];
        let paramIndex = 1;

        if (filters.user_id) {
            whereClause += ` AND e.user_id = $${paramIndex}`;
            params.push(filters.user_id);
            paramIndex++;
        }

        if (filters.category_id) {
            whereClause += ` AND e.category_id = $${paramIndex}`;
            params.push(filters.category_id);
            paramIndex++;
        }

        if (filters.start_date) {
            whereClause += ` AND e.date >= $${paramIndex}`;
            params.push(filters.start_date);
            paramIndex++;
        }

        if (filters.end_date) {
            whereClause += ` AND e.date <= $${paramIndex}`;
            params.push(filters.end_date);
            paramIndex++;
        }

        const countQuery = `
            SELECT COUNT(*) as total
            FROM expenses e
            JOIN users u ON e.user_id = u.id
            JOIN categories c ON e.category_id = c.id
            ${whereClause}
        `;
        const countResult = await query(countQuery, params);
        const total = parseInt(countResult.rows[0].total);

        const dataQuery = `
            SELECT 
                e.id, e.user_id, e.category_id, e.amount, 
                TO_CHAR(e.date, 'YYYY-MM-DD') as date,
                e.description, e.created_at, e.updated_at,
                u.name as user_name,
                c.name as category_name
            FROM expenses e
            JOIN users u ON e.user_id = u.id
            JOIN categories c ON e.category_id = c.id
            ${whereClause}
            ORDER BY e.date DESC, e.created_at DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        const dataParams = [...params, limit, offset];
        const result = await query(dataQuery, dataParams);

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            message: 'Expenses fetched successfully',
            data: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch expenses',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getExpenseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT 
                e.id, e.user_id, e.category_id, e.amount,
                TO_CHAR(e.date, 'YYYY-MM-DD') as date,
                e.description, e.created_at, e.updated_at,
                u.name as user_name,
                c.name as category_name
            FROM expenses e
            JOIN users u ON e.user_id = u.id
            JOIN categories c ON e.category_id = c.id
            WHERE e.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
            return;
        }

        const response: ApiResponse<ExpenseWithDetails> = {
            success: true,
            message: 'Expense fetched successfully',
            data: result.rows[0]
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching expense:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch expense',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const createExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id, category_id, amount, date, description }: CreateExpenseDTO = req.body;

        const userCheck = await query('SELECT id FROM users WHERE id = $1', [user_id]);
        if (userCheck.rows.length === 0) {
            res.status(400).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        const categoryCheck = await query('SELECT id FROM categories WHERE id = $1', [category_id]);
        if (categoryCheck.rows.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Category not found'
            });
            return;
        }

        const result = await query(
            `INSERT INTO expenses (user_id, category_id, amount, date, description)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, user_id, category_id, amount, 
                       TO_CHAR(date, 'YYYY-MM-DD') as date, 
                       description, created_at, updated_at`,
            [user_id, category_id, amount, date, description || null]
        );

        const expenseResult = await query(
            `SELECT 
                e.id, e.user_id, e.category_id, e.amount,
                TO_CHAR(e.date, 'YYYY-MM-DD') as date,
                e.description, e.created_at, e.updated_at,
                u.name as user_name,
                c.name as category_name
            FROM expenses e
            JOIN users u ON e.user_id = u.id
            JOIN categories c ON e.category_id = c.id
            WHERE e.id = $1`,
            [result.rows[0].id]
        );

        const response: ApiResponse<ExpenseWithDetails> = {
            success: true,
            message: 'Expense created successfully',
            data: expenseResult.rows[0]
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create expense',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData: UpdateExpenseDTO = req.body;

        const existingExpense = await query('SELECT id FROM expenses WHERE id = $1', [id]);
        if (existingExpense.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
            return;
        }

        if (updateData.user_id) {
            const userCheck = await query('SELECT id FROM users WHERE id = $1', [updateData.user_id]);
            if (userCheck.rows.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
        }

        if (updateData.category_id) {
            const categoryCheck = await query('SELECT id FROM categories WHERE id = $1', [updateData.category_id]);
            if (categoryCheck.rows.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Category not found'
                });
                return;
            }
        }

        const updates: string[] = [];
        const values: (string | number | null)[] = [];
        let paramIndex = 1;

        if (updateData.user_id !== undefined) {
            updates.push(`user_id = $${paramIndex}`);
            values.push(updateData.user_id);
            paramIndex++;
        }

        if (updateData.category_id !== undefined) {
            updates.push(`category_id = $${paramIndex}`);
            values.push(updateData.category_id);
            paramIndex++;
        }

        if (updateData.amount !== undefined) {
            updates.push(`amount = $${paramIndex}`);
            values.push(updateData.amount);
            paramIndex++;
        }

        if (updateData.date !== undefined) {
            updates.push(`date = $${paramIndex}`);
            values.push(updateData.date);
            paramIndex++;
        }

        if (updateData.description !== undefined) {
            updates.push(`description = $${paramIndex}`);
            values.push(updateData.description);
            paramIndex++;
        }

        if (updates.length === 0) {
            res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
            return;
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(parseInt(id));

        await query(
            `UPDATE expenses SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
            values
        );

        const result = await query(
            `SELECT 
                e.id, e.user_id, e.category_id, e.amount,
                TO_CHAR(e.date, 'YYYY-MM-DD') as date,
                e.description, e.created_at, e.updated_at,
                u.name as user_name,
                c.name as category_name
            FROM expenses e
            JOIN users u ON e.user_id = u.id
            JOIN categories c ON e.category_id = c.id
            WHERE e.id = $1`,
            [id]
        );

        const response: ApiResponse<ExpenseWithDetails> = {
            success: true,
            message: 'Expense updated successfully',
            data: result.rows[0]
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update expense',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const existingExpense = await query(
            `SELECT 
                e.id, e.user_id, e.category_id, e.amount,
                TO_CHAR(e.date, 'YYYY-MM-DD') as date,
                e.description,
                u.name as user_name,
                c.name as category_name
            FROM expenses e
            JOIN users u ON e.user_id = u.id
            JOIN categories c ON e.category_id = c.id
            WHERE e.id = $1`,
            [id]
        );

        if (existingExpense.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
            return;
        }

        await query('DELETE FROM expenses WHERE id = $1', [id]);

        const response: ApiResponse<ExpenseWithDetails> = {
            success: true,
            message: 'Expense deleted successfully',
            data: existingExpense.rows[0]
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete expense',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

