import { BarChart3, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopDaysCard } from './TopDaysCard';
import { MonthlyChangeCard } from './MonthlyChangeCard';
import { PredictionCard } from './PredictionCard';
import { useAllStatistics } from '@/hooks/useStatistics';

export function StatisticsPanel() {
    const { data, isLoading, refetch, isFetching } = useAllStatistics();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                        <BarChart3 className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Statistics Dashboard</h2>
                        <p className="text-sm text-slate-400">Expense analysis and predictions</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                    <RefreshCcw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TopDaysCard 
                    data={data?.topDaysExpenditure} 
                    isLoading={isLoading} 
                />
                <MonthlyChangeCard 
                    data={data?.monthlyPercentageChange} 
                    isLoading={isLoading} 
                />
                <PredictionCard 
                    data={data?.predictedExpenditure} 
                    isLoading={isLoading} 
                />
            </div>
        </div>
    );
}

