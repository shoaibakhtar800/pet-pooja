import { Request, Response } from 'express';
import { query } from '../config/database';
import { TopDayExpenditure, MonthlyPercentageChange, ExpenditurePrediction, ApiResponse } from '../types';

export const getTopDaysExpenditure = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await query(`
            WITH daily_totals AS (
                SELECT 
                    e.user_id,
                    u.name as user_name,
                    e.date,
                    SUM(e.amount) as total_amount
                FROM expenses e
                JOIN users u ON e.user_id = u.id
                GROUP BY e.user_id, u.name, e.date
            ),
            ranked_days AS (
                SELECT 
                    user_id,
                    user_name,
                    TO_CHAR(date, 'YYYY-MM-DD') as date,
                    total_amount::numeric as total_amount,
                    ROW_NUMBER() OVER (
                        PARTITION BY user_id 
                        ORDER BY total_amount DESC
                    ) as rank
                FROM daily_totals
            )
            SELECT 
                user_id,
                user_name,
                date,
                total_amount,
                rank
            FROM ranked_days
            WHERE rank <= 3
            ORDER BY user_id, total_amount DESC
        `);

        const response: ApiResponse<TopDayExpenditure[]> = {
            success: true,
            message: "Top 3 days expenditure for each user fetched successfully",
            data: result.rows
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching top days expenditure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch top days expenditure',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getMonthlyPercentageChange = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await query(`
            WITH monthly_totals AS (
                SELECT 
                    e.user_id,
                    u.name as user_name,
                    DATE_TRUNC('month', e.date) as month,
                    SUM(e.amount) as total_amount
                FROM expenses e
                JOIN users u ON e.user_id = u.id
                GROUP BY e.user_id, u.name, DATE_TRUNC('month', e.date)
            ),
            current_prev_comparison AS (
                SELECT 
                    mt.user_id,
                    mt.user_name,
                    mt.month as current_month,
                    mt.total_amount as current_month_total,
                    LAG(mt.month) OVER (
                        PARTITION BY mt.user_id 
                        ORDER BY mt.month
                    ) as previous_month,
                    LAG(mt.total_amount) OVER (
                        PARTITION BY mt.user_id 
                        ORDER BY mt.month
                    ) as previous_month_total
                FROM monthly_totals mt
            )
            SELECT 
                user_id,
                user_name,
                TO_CHAR(current_month, 'YYYY-MM') as current_month,
                current_month_total::numeric,
                TO_CHAR(previous_month, 'YYYY-MM') as previous_month,
                COALESCE(previous_month_total, 0)::numeric as previous_month_total,
                CASE 
                    WHEN previous_month_total IS NULL OR previous_month_total = 0 THEN 
                        CASE WHEN current_month_total > 0 THEN 100 ELSE 0 END
                    ELSE 
                        ROUND(((current_month_total - previous_month_total) / previous_month_total * 100)::numeric, 2)
                END as percentage_change
            FROM current_prev_comparison
            WHERE previous_month IS NOT NULL
            ORDER BY user_id, current_month DESC
        `);

        const response: ApiResponse<MonthlyPercentageChange[]> = {
            success: true,
            message: "Monthly percentage change for each user fetched successfully",
            data: result.rows
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching monthly percentage change:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch monthly percentage change',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getPredictedExpenditure = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await query(`
            WITH last_3_months AS (
                SELECT 
                    e.user_id,
                    u.name as user_name,
                    DATE_TRUNC('month', e.date) as month,
                    SUM(e.amount) as monthly_total
                FROM expenses e
                JOIN users u ON e.user_id = u.id
                WHERE e.date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months'
                  AND e.date < DATE_TRUNC('month', CURRENT_DATE)
                GROUP BY e.user_id, u.name, DATE_TRUNC('month', e.date)
            ),
            monthly_breakdown AS (
                SELECT 
                    user_id,
                    user_name,
                    month,
                    monthly_total,
                    ROW_NUMBER() OVER (
                        PARTITION BY user_id 
                        ORDER BY month DESC
                    ) as month_rank
                FROM last_3_months
            ),
            pivoted_months AS (
                SELECT 
                    user_id,
                    user_name,
                    COALESCE(MAX(CASE WHEN month_rank = 1 THEN monthly_total END), 0) as month_1_total,
                    COALESCE(MAX(CASE WHEN month_rank = 2 THEN monthly_total END), 0) as month_2_total,
                    COALESCE(MAX(CASE WHEN month_rank = 3 THEN monthly_total END), 0) as month_3_total
                FROM monthly_breakdown
                GROUP BY user_id, user_name
            )
            SELECT 
                user_id,
                user_name,
                month_1_total::numeric,
                month_2_total::numeric,
                month_3_total::numeric,
                ROUND(((month_1_total + month_2_total + month_3_total) / 
                    NULLIF(
                        (CASE WHEN month_1_total > 0 THEN 1 ELSE 0 END +
                         CASE WHEN month_2_total > 0 THEN 1 ELSE 0 END +
                         CASE WHEN month_3_total > 0 THEN 1 ELSE 0 END), 0
                    ))::numeric, 2) as average_spending,
                ROUND(((month_1_total + month_2_total + month_3_total) / 
                    NULLIF(
                        (CASE WHEN month_1_total > 0 THEN 1 ELSE 0 END +
                         CASE WHEN month_2_total > 0 THEN 1 ELSE 0 END +
                         CASE WHEN month_3_total > 0 THEN 1 ELSE 0 END), 0
                    ))::numeric, 2) as predicted_next_month
            FROM pivoted_months
            WHERE (month_1_total + month_2_total + month_3_total) > 0
            ORDER BY user_id
        `);

        const response: ApiResponse<ExpenditurePrediction[]> = {
            success: true,
            message: "Predicted expenditure for next month fetched successfully",
            data: result.rows
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching predicted expenditure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch predicted expenditure',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getAllStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
        const [topDaysResult, percentageChangeResult, predictionResult] = await Promise.all([
            query(`
                WITH daily_totals AS (
                    SELECT 
                        e.user_id,
                        u.name as user_name,
                        e.date,
                        SUM(e.amount) as total_amount
                    FROM expenses e
                    JOIN users u ON e.user_id = u.id
                    GROUP BY e.user_id, u.name, e.date
                ),
                ranked_days AS (
                    SELECT 
                        user_id,
                        user_name,
                        TO_CHAR(date, 'YYYY-MM-DD') as date,
                        total_amount::numeric as total_amount,
                        ROW_NUMBER() OVER (
                            PARTITION BY user_id 
                            ORDER BY total_amount DESC
                        ) as rank
                    FROM daily_totals
                )
                SELECT user_id, user_name, date, total_amount, rank
                FROM ranked_days
                WHERE rank <= 3
                ORDER BY user_id, total_amount DESC
            `),
            query(`
                WITH monthly_totals AS (
                    SELECT 
                        e.user_id,
                        u.name as user_name,
                        DATE_TRUNC('month', e.date) as month,
                        SUM(e.amount) as total_amount
                    FROM expenses e
                    JOIN users u ON e.user_id = u.id
                    GROUP BY e.user_id, u.name, DATE_TRUNC('month', e.date)
                ),
                current_prev_comparison AS (
                    SELECT 
                        mt.user_id,
                        mt.user_name,
                        mt.month as current_month,
                        mt.total_amount as current_month_total,
                        LAG(mt.month) OVER (PARTITION BY mt.user_id ORDER BY mt.month) as previous_month,
                        LAG(mt.total_amount) OVER (PARTITION BY mt.user_id ORDER BY mt.month) as previous_month_total
                    FROM monthly_totals mt
                )
                SELECT 
                    user_id, user_name,
                    TO_CHAR(current_month, 'YYYY-MM') as current_month,
                    current_month_total::numeric,
                    TO_CHAR(previous_month, 'YYYY-MM') as previous_month,
                    COALESCE(previous_month_total, 0)::numeric as previous_month_total,
                    CASE 
                        WHEN previous_month_total IS NULL OR previous_month_total = 0 THEN 
                            CASE WHEN current_month_total > 0 THEN 100 ELSE 0 END
                        ELSE ROUND(((current_month_total - previous_month_total) / previous_month_total * 100)::numeric, 2)
                    END as percentage_change
                FROM current_prev_comparison
                WHERE previous_month IS NOT NULL
                ORDER BY user_id, current_month DESC
            `),
            query(`
                WITH last_3_months AS (
                    SELECT 
                        e.user_id,
                        u.name as user_name,
                        DATE_TRUNC('month', e.date) as month,
                        SUM(e.amount) as monthly_total
                    FROM expenses e
                    JOIN users u ON e.user_id = u.id
                    WHERE e.date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months'
                      AND e.date < DATE_TRUNC('month', CURRENT_DATE)
                    GROUP BY e.user_id, u.name, DATE_TRUNC('month', e.date)
                ),
                monthly_breakdown AS (
                    SELECT user_id, user_name, month, monthly_total,
                        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY month DESC) as month_rank
                    FROM last_3_months
                ),
                pivoted_months AS (
                    SELECT 
                        user_id, user_name,
                        COALESCE(MAX(CASE WHEN month_rank = 1 THEN monthly_total END), 0) as month_1_total,
                        COALESCE(MAX(CASE WHEN month_rank = 2 THEN monthly_total END), 0) as month_2_total,
                        COALESCE(MAX(CASE WHEN month_rank = 3 THEN monthly_total END), 0) as month_3_total
                    FROM monthly_breakdown
                    GROUP BY user_id, user_name
                )
                SELECT 
                    user_id, user_name,
                    month_1_total::numeric, month_2_total::numeric, month_3_total::numeric,
                    ROUND(((month_1_total + month_2_total + month_3_total) / 
                        NULLIF((CASE WHEN month_1_total > 0 THEN 1 ELSE 0 END +
                                CASE WHEN month_2_total > 0 THEN 1 ELSE 0 END +
                                CASE WHEN month_3_total > 0 THEN 1 ELSE 0 END), 0))::numeric, 2) as average_spending,
                    ROUND(((month_1_total + month_2_total + month_3_total) / 
                        NULLIF((CASE WHEN month_1_total > 0 THEN 1 ELSE 0 END +
                                CASE WHEN month_2_total > 0 THEN 1 ELSE 0 END +
                                CASE WHEN month_3_total > 0 THEN 1 ELSE 0 END), 0))::numeric, 2) as predicted_next_month
                FROM pivoted_months
                WHERE (month_1_total + month_2_total + month_3_total) > 0
                ORDER BY user_id
            `)
        ]);

        res.status(200).json({
            success: true,
            message: "All statistics fetched successfully",
            data: {
                topDaysExpenditure: topDaysResult.rows,
                monthlyPercentageChange: percentageChangeResult.rows,
                predictedExpenditure: predictionResult.rows
            }
        });
    } catch (error) {
        console.error('Error fetching all statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

