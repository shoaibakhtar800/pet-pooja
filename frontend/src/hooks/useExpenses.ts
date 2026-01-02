import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesApi } from '@/lib/api';
import type { GetExpensesParams } from '@/lib/api';
import type { CreateExpenseDTO, UpdateExpenseDTO } from '@/types';
import { toast } from 'sonner';

export const useExpenses = (params?: GetExpensesParams) => {
    return useQuery({
        queryKey: ['expenses', params],
        queryFn: () => expensesApi.getAll(params),
        placeholderData: (previousData) => previousData,
    });
};

export const useExpense = (id: number) => {
    return useQuery({
        queryKey: ['expenses', id],
        queryFn: () => expensesApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateExpense = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: CreateExpenseDTO) => expensesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            toast.success('Expense created successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create expense');
        },
    });
};

export const useUpdateExpense = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateExpenseDTO }) => 
            expensesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            toast.success('Expense updated successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update expense');
        },
    });
};

export const useDeleteExpense = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: number) => expensesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            toast.success('Expense deleted successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete expense');
        },
    });
};
