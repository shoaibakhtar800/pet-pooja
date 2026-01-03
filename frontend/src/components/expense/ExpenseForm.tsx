import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useActiveUsers } from '@/hooks/useUsers';
import { useCategories } from '@/hooks/useCategories';
import { useCreateExpense, useUpdateExpense } from '@/hooks/useExpenses';
import { createExpenseSchema, type CreateExpenseFormData } from '@/schemas/expense.schema';
import type { Expense } from '@/types';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface ExpenseFormProps {
    expense?: Expense;
    onClose?: () => void;
    trigger?: React.ReactNode;
}

export function ExpenseForm({ expense, onClose, trigger }: ExpenseFormProps) {
    const [open, setOpen] = useState(false);
    const { data: users, isLoading: usersLoading } = useActiveUsers();
    const { data: categories, isLoading: categoriesLoading } = useCategories();
    const createExpense = useCreateExpense();
    const updateExpense = useUpdateExpense();

    const isEditing = !!expense;

    const form = useForm<CreateExpenseFormData>({
        resolver: zodResolver(createExpenseSchema),
        defaultValues: {
            user_id: expense?.user_id || 0,
            category_id: expense?.category_id || 0,
            amount: expense?.amount || 0,
            date: expense?.date || format(new Date(), 'yyyy-MM-dd'),
            description: expense?.description || '',
        },
    });

    useEffect(() => {
        if (expense) {
            form.reset({
                user_id: expense.user_id,
                category_id: expense.category_id,
                amount: expense.amount,
                date: expense.date,
                description: expense.description || '',
            });
        }
    }, [expense, form]);

    const onSubmit = async (data: CreateExpenseFormData) => {
        try {
            if (isEditing && expense) {
                await updateExpense.mutateAsync({ id: expense.id, data });
            } else {
                await createExpense.mutateAsync(data);
            }
            form.reset({
                user_id: 0,
                category_id: 0,
                amount: 0,
                date: format(new Date(), 'yyyy-MM-dd'),
                description: '',
            });
            setOpen(false);
            onClose?.();
        } catch (error) {
            console.error('Error submitting expense:', error);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            form.reset();
            onClose?.();
        }
    };

    const isSubmitting = createExpense.isPending || updateExpense.isPending;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25">
                        <Plus className="h-4 w-4" />
                        Add Expense
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        {isEditing ? 'Edit Expense' : 'Add New Expense'}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="user_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">User</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                            value={field.value > 0 ? field.value.toString() : undefined}
                                            disabled={usersLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                                                    <SelectValue placeholder="Select user" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-slate-800 border-slate-600">
                                                {users?.map((user) => (
                                                    <SelectItem
                                                        key={user.id}
                                                        value={user.id.toString()}
                                                        className="text-white hover:bg-slate-700"
                                                    >
                                                        {user.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Category</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                            value={field.value > 0 ? field.value.toString() : undefined}
                                            disabled={categoriesLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-slate-800 border-slate-600">
                                                {categories?.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id.toString()}
                                                        className="text-white hover:bg-slate-700"
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Amount (₹)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                placeholder="Enter amount"
                                                className="bg-slate-800 border-slate-600 text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                                                value={field.value || ''}
                                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                                ref={field.ref}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'w-full pl-3 text-left font-normal bg-slate-800 border-slate-600 text-white hover:bg-slate-700',
                                                            !field.value && 'text-slate-400'
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(new Date(field.value), 'PPP')
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            field.onChange(format(date, 'yyyy-MM-dd'));
                                                        }
                                                    }}
                                                    disabled={(date) => date > new Date()}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter expense description..."
                                            className="bg-slate-800 border-slate-600 text-white resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? 'Update Expense' : 'Add Expense'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

