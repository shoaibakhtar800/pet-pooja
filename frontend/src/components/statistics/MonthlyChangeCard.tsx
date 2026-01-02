import { TrendingUp, TrendingDown, Minus, IndianRupee, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { MonthlyPercentageChange } from '@/types';

interface MonthlyChangeCardProps {
    data: MonthlyPercentageChange[] | undefined;
    isLoading: boolean;
}

export function MonthlyChangeCard({ data, isLoading }: MonthlyChangeCardProps) {
    if (isLoading) {
        return (
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                    <Skeleton className="h-6 w-48 bg-slate-700" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full bg-slate-700" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    const getTrendIcon = (change: number) => {
        if (change > 0) return <TrendingUp className="h-5 w-5 text-red-400" />;
        if (change < 0) return <TrendingDown className="h-5 w-5 text-emerald-400" />;
        return <Minus className="h-5 w-5 text-slate-400" />;
    };

    const getTrendColor = (change: number) => {
        if (change > 0) return 'text-red-400';
        if (change < 0) return 'text-emerald-400';
        return 'text-slate-400';
    };

    const formatMonth = (monthStr: string) => {
        const [year, month] = monthStr.split('-');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[parseInt(month) - 1]} ${year}`;
    };

    return (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                    </div>
                    Monthly Change Analysis
                </CardTitle>
                <p className="text-sm text-slate-400">Percentage change from previous month</p>
            </CardHeader>
            <CardContent>
                {!data || data.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No data available</p>
                ) : (
                    <div className="space-y-4">
                        {data.map((item, index) => (
                            <div
                                key={`${item.user_id}-${item.current_month}-${index}`}
                                className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-medium text-white">{item.user_name}</span>
                                    <div className={`flex items-center gap-1 font-semibold ${getTrendColor(item.percentage_change)}`}>
                                        {getTrendIcon(item.percentage_change)}
                                        <span>{Math.abs(item.percentage_change).toFixed(1)}%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="text-center">
                                        <p className="text-slate-500 mb-1">{item.previous_month ? formatMonth(item.previous_month) : 'N/A'}</p>
                                        <p className="flex items-center text-slate-300">
                                            <IndianRupee className="h-3 w-3" />
                                            {Number(item.previous_month_total).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-600" />
                                    <div className="text-center">
                                        <p className="text-slate-500 mb-1">{formatMonth(item.current_month)}</p>
                                        <p className="flex items-center text-white font-medium">
                                            <IndianRupee className="h-3 w-3" />
                                            {Number(item.current_month_total).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

