import { Request, Response } from 'express';
import { query } from '../config/database';
import { User, ApiResponse } from '../types';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await query(
            `SELECT id, name, email, status, created_at, updated_at 
             FROM users 
             ORDER BY name ASC`
        );
        
        const response: ApiResponse<User[]> = {
            success: true,
            message: 'Users fetched successfully',
            data: result.rows
        };
        
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getActiveUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await query(
            `SELECT id, name, email, status, created_at, updated_at 
             FROM users 
             WHERE status = 'active'
             ORDER BY name ASC`
        );
        
        const response: ApiResponse<User[]> = {
            success: true,
            message: 'Active users fetched successfully',
            data: result.rows
        };
        
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching active users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch active users',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

