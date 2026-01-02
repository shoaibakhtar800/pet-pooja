export interface User {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    created_at: Date;
    updated_at: Date;
}

export interface Category {
    id: number;
    name: string;
    created_at: Date;
}

export interface Expense {
    id: number;
    user_id: number;
    category_id: number;
    amount: number;
    date: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface ExpenseWithDetails extends Expense {
    user_name: string;
    category_name: string;
}

export interface CreateExpenseDTO {
    user_id: number;
    category_id: number;
    amount: number;
    date: string;
    description?: string;
}

export interface UpdateExpenseDTO {
    user_id?: number;
    category_id?: number;
    amount?: number;
    date?: string;
    description?: string;
}

export interface TopDayExpenditure {
    user_id: number;
    user_name: string;
    date: string;
    total_amount: number;
    rank: number;
}

export interface MonthlyPercentageChange {
    user_id: number;
    user_name: string;
    current_month: string;
    current_month_total: number;
    previous_month: string;
    previous_month_total: number;
    percentage_change: number;
}

export interface ExpenditurePrediction {
    user_id: number;
    user_name: string;
    month_1_total: number;
    month_2_total: number;
    month_3_total: number;
    average_spending: number;
    predicted_next_month: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface ExpenseFilters {
    user_id?: number;
    category_id?: number;
    start_date?: string;
    end_date?: string;
}

