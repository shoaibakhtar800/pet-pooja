import { Request, Response } from 'express';
import { query } from '../config/database';
import { Category, ApiResponse } from '../types';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await query(
            `SELECT id, name, created_at 
             FROM categories 
             ORDER BY name ASC`
        );
        
        const response: ApiResponse<Category[]> = {
            success: true,
            message: 'Categories fetched successfully',
            data: result.rows
        };
        
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

