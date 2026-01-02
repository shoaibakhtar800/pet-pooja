import { Sparkles, IndianRupee, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ExpenditurePrediction } from '@/types';

interface PredictionCardProps {
    data: ExpenditurePrediction[] | undefined;
    isLoading: boolean;
}

export function PredictionCard({ data, isLoading }: PredictionCardProps) {
    if (isLoading) {
        return (
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                    <Skeleton className="h-6 w-48 bg-slate-700" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full bg-slate-700" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                        <Sparkles className="h-5 w-5 text-purple-400" />
                    </div>
                    Next Month Prediction
                </CardTitle>
                <p className="text-sm text-slate-400">Based on last 3 months average spending</p>
            </CardHeader>
            <CardContent>
                {!data || data.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No data available</p>
                ) : (
                    <div className="space-y-4">
                        {data.map((item) => (
                            <div
                                key={item.user_id}
                                className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-medium text-white">{item.user_name}</span>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                                        <Sparkles className="h-4 w-4 text-purple-400" />
                                        <span className="text-purple-300 font-semibold flex items-center">
                                            <IndianRupee className="h-4 w-4" />
                                            {Number(item.predicted_next_month).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    <div className="text-center p-2 rounded bg-slate-800/50">
                                        <p className="text-xs text-slate-500 mb-1">Month 1</p>
                                        <p className="text-sm text-slate-300 flex items-center justify-center">
                                            <IndianRupee className="h-3 w-3" />
                                            {Number(item.month_1_total).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div className="text-center p-2 rounded bg-slate-800/50">
                                        <p className="text-xs text-slate-500 mb-1">Month 2</p>
                                        <p className="text-sm text-slate-300 flex items-center justify-center">
                                            <IndianRupee className="h-3 w-3" />
                                            {Number(item.month_2_total).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div className="text-center p-2 rounded bg-slate-800/50">
                                        <p className="text-xs text-slate-500 mb-1">Month 3</p>
                                        <p className="text-sm text-slate-300 flex items-center justify-center">
                                            <IndianRupee className="h-3 w-3" />
                                            {Number(item.month_3_total).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                                    <Calculator className="h-4 w-4" />
                                    <span>Avg: ₹{Number(item.average_spending).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

