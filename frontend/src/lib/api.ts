import axios from 'axios';
import type { 
    ApiResponse, 
    User, 
    Category, 
    Expense, 
    CreateExpenseDTO, 
    UpdateExpenseDTO,
    AllStatistics,
    TopDayExpenditure,
    MonthlyPercentageChange,
    ExpenditurePrediction,
    ExpenseFilters,
    PaginatedResponse
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const usersApi = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get<ApiResponse<User[]>>('/users');
        return response.data.data || [];
    },
    
    getActive: async (): Promise<User[]> => {
        const response = await api.get<ApiResponse<User[]>>('/users/active');
        return response.data.data || [];
    },
};

export const categoriesApi = {
    getAll: async (): Promise<Category[]> => {
        const response = await api.get<ApiResponse<Category[]>>('/categories');
        return response.data.data || [];
    },
};

export interface GetExpensesParams extends ExpenseFilters {
    page?: number;
    limit?: number;
}

export const expensesApi = {
    getAll: async (params?: GetExpensesParams): Promise<PaginatedResponse<Expense>> => {
        const searchParams = new URLSearchParams();
        
        if (params?.user_id) searchParams.append('user_id', params.user_id.toString());
        if (params?.category_id) searchParams.append('category_id', params.category_id.toString());
        if (params?.start_date) searchParams.append('start_date', params.start_date);
        if (params?.end_date) searchParams.append('end_date', params.end_date);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        
        const response = await api.get<PaginatedResponse<Expense>>(`/expenses?${searchParams.toString()}`);
        return response.data;
    },
    
    getById: async (id: number): Promise<Expense> => {
        const response = await api.get<ApiResponse<Expense>>(`/expenses/${id}`);
        if (!response.data.data) throw new Error('Expense not found');
        return response.data.data;
    },
    
    create: async (data: CreateExpenseDTO): Promise<Expense> => {
        const response = await api.post<ApiResponse<Expense>>('/expenses', data);
        if (!response.data.data) throw new Error(response.data.message || 'Failed to create expense');
        return response.data.data;
    },
    
    update: async (id: number, data: UpdateExpenseDTO): Promise<Expense> => {
        const response = await api.put<ApiResponse<Expense>>(`/expenses/${id}`, data);
        if (!response.data.data) throw new Error(response.data.message || 'Failed to update expense');
        return response.data.data;
    },
    
    delete: async (id: number): Promise<void> => {
        await api.delete(`/expenses/${id}`);
    },
};

export const statisticsApi = {
    getAll: async (): Promise<AllStatistics> => {
        const response = await api.get<ApiResponse<AllStatistics>>('/statistics');
        return response.data.data || {
            topDaysExpenditure: [],
            monthlyPercentageChange: [],
            predictedExpenditure: []
        };
    },
    
    getTopDays: async (): Promise<TopDayExpenditure[]> => {
        const response = await api.get<ApiResponse<TopDayExpenditure[]>>('/statistics/top-days');
        return response.data.data || [];
    },
    
    getMonthlyChange: async (): Promise<MonthlyPercentageChange[]> => {
        const response = await api.get<ApiResponse<MonthlyPercentageChange[]>>('/statistics/monthly-change');
        return response.data.data || [];
    },
    
    getPrediction: async (): Promise<ExpenditurePrediction[]> => {
        const response = await api.get<ApiResponse<ExpenditurePrediction[]>>('/statistics/prediction');
        return response.data.data || [];
    },
};

export default api;
