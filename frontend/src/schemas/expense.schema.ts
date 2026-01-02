import { z } from 'zod';

export const createExpenseSchema = z.object({
    user_id: z.number({ message: 'Please select a user' }).min(1, 'Please select a user'),
    
    category_id: z.number({ message: 'Please select a category' }).min(1, 'Please select a category'),
    
    amount: z.number({ message: 'Amount must be a number' }).positive('Amount must be greater than 0'),
    
    date: z.string({ message: 'Date is required' }).min(1, 'Date is required'),
    
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseFormData = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseFormData = z.infer<typeof updateExpenseSchema>;
