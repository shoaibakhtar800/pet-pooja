import { format } from 'date-fns';
import { Edit2, Trash2, IndianRupee, User, Calendar, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ExpenseForm } from './ExpenseForm';
import { useDeleteExpense } from '@/hooks/useExpenses';
import type { Expense, PaginationInfo } from '@/types';

interface ExpenseListProps {
    expenses: Expense[] | undefined;
    isLoading: boolean;
    isFetching?: boolean;
    pagination?: PaginationInfo;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

function ExpenseListSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div 
                    key={i} 
                    className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-8 w-32 bg-slate-700" />
                                <Skeleton className="h-6 w-24 rounded-full bg-slate-700" />
                            </div>
                            <div className="flex gap-4">
                                <Skeleton className="h-4 w-28 bg-slate-700" />
                                <Skeleton className="h-4 w-32 bg-slate-700" />
                                <Skeleton className="h-4 w-40 bg-slate-700" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-8 bg-slate-700" />
                            <Skeleton className="h-8 w-8 bg-slate-700" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ExpenseList({ expenses, isLoading, isFetching, pagination, onPageChange, onLimitChange }: ExpenseListProps) {
    const deleteExpense = useDeleteExpense();

    const handleDelete = async (id: number) => {
        await deleteExpense.mutateAsync(id);
    };

    if (isLoading) {
        return <ExpenseListSkeleton />;
    }

    if (!expenses || expenses.length === 0) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-slate-700/50 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-slate-700/50">
                        <IndianRupee className="h-8 w-8 text-slate-400" />
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No expenses found</h3>
                <p className="text-slate-400 mb-6">Start tracking your expenses by adding one!</p>
                <ExpenseForm />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary Card */}
            {pagination && (
                <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl p-5 border border-emerald-500/30 relative overflow-hidden">
                    {isFetching && (
                        <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-emerald-300">Total Records</p>
                            <p className="text-2xl font-bold text-white">{pagination.total}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-emerald-300">Showing</p>
                            <p className="text-lg font-semibold text-white">
                                {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Expense Items */}
            {expenses.map((expense, index) => (
                <div
                    key={expense.id}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all group animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl font-bold text-emerald-400 flex items-center">
                                    <IndianRupee className="h-5 w-5" />
                                    {Number(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                                    {expense.category_name}
                                </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <User className="h-4 w-4 text-slate-500" />
                                    {expense.user_name}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                    {format(new Date(expense.date), 'PPP')}
                                </span>
                                {expense.description && (
                                    <span className="flex items-center gap-1.5">
                                        <FileText className="h-4 w-4 text-slate-500" />
                                        {expense.description}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExpenseForm
                                expense={expense}
                                trigger={
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                }
                            />
                            
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-600/50 text-red-400 hover:bg-red-600/20 hover:text-red-300"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-slate-900 border-slate-700">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-white">Delete Expense</AlertDialogTitle>
                                        <AlertDialogDescription className="text-slate-400">
                                            Are you sure you want to delete this expense of ₹{Number(expense.amount).toLocaleString('en-IN')}? 
                                            This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDelete(expense.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">Rows per page:</span>
                        <Select
                            value={pagination.limit.toString()}
                            onValueChange={(value) => onLimitChange(parseInt(value))}
                        >
                            <SelectTrigger className="w-[80px] bg-slate-900/50 border-slate-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                                {[5, 10, 20, 50].map((size) => (
                                    <SelectItem key={size} value={size.toString()} className="text-white">
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(pagination.page - 1)}
                                disabled={!pagination.hasPrevPage}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            {/* Page numbers */}
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                let pageNum: number;
                                if (pagination.totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (pagination.page <= 3) {
                                    pageNum = i + 1;
                                } else if (pagination.page >= pagination.totalPages - 2) {
                                    pageNum = pagination.totalPages - 4 + i;
                                } else {
                                    pageNum = pagination.page - 2 + i;
                                }
                                
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={pagination.page === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => onPageChange(pageNum)}
                                        className={
                                            pagination.page === pageNum
                                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                                : "border-slate-600 text-slate-300 hover:bg-slate-700"
                                        }
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                            
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(pagination.page + 1)}
                                disabled={!pagination.hasNextPage}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
