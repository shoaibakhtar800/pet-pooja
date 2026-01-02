import { useState } from 'react';
import { Wallet, Receipt, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpenseForm } from './expense/ExpenseForm';
import { ExpenseFilters } from './expense/ExpenseFilters';
import { ExpenseList } from './expense/ExpenseList';
import { StatisticsPanel } from './statistics/StatisticsPanel';
import { useExpenses } from '@/hooks/useExpenses';
import type { ExpenseFilters as ExpenseFiltersType } from '@/types';

export function Dashboard() {
    const [filters, setFilters] = useState<ExpenseFiltersType>({
        user_id: '',
        category_id: '',
        start_date: '',
        end_date: '',
    });
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading, isFetching } = useExpenses({
        ...filters,
        page,
        limit,
    });

    const handleFiltersChange = (newFilters: ExpenseFiltersType) => {
        setFilters(newFilters);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            {/* Main content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/50">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                                    <Wallet className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white tracking-tight">
                                        Expense Tracker
                                    </h1>
                                    <p className="text-slate-400 text-sm">
                                        Manage and analyze your expenses
                                    </p>
                                </div>
                            </div>
                            <ExpenseForm />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                    <Tabs defaultValue="expenses" className="space-y-6">
                        <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1">
                            <TabsTrigger 
                                value="expenses" 
                                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 gap-2"
                            >
                                <Receipt className="h-4 w-4" />
                                Expenses
                            </TabsTrigger>
                            <TabsTrigger 
                                value="statistics" 
                                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 gap-2"
                            >
                                <BarChart3 className="h-4 w-4" />
                                Statistics
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="expenses" className="space-y-6">
                            <ExpenseFilters 
                                filters={filters} 
                                onFiltersChange={handleFiltersChange} 
                            />
                            <ExpenseList 
                                expenses={data?.data} 
                                isLoading={isLoading}
                                isFetching={isFetching}
                                pagination={data?.pagination}
                                onPageChange={handlePageChange}
                                onLimitChange={handleLimitChange}
                            />
                        </TabsContent>

                        <TabsContent value="statistics">
                            <StatisticsPanel />
                        </TabsContent>
                    </Tabs>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-800/50 py-6">
                    <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
                        <p>Pet Pooja | React + Node.js</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
