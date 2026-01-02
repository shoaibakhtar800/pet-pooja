import { format } from 'date-fns';
import { Trophy, IndianRupee, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { TopDayExpenditure } from '@/types';

interface TopDaysCardProps {
    data: TopDayExpenditure[] | undefined;
    isLoading: boolean;
}

export function TopDaysCard({ data, isLoading }: TopDaysCardProps) {
    if (isLoading) {
        return (
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                    <Skeleton className="h-6 w-48 bg-slate-700" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full bg-slate-700" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    const groupedByUser: Record<number, TopDayExpenditure[]> = {};
    data?.forEach((item) => {
        if (!groupedByUser[item.user_id]) {
            groupedByUser[item.user_id] = [];
        }
        groupedByUser[item.user_id].push(item);
    });

    const getRankBadge = (rank: number) => {
        const colors: Record<number, string> = {
            1: 'from-yellow-500 to-amber-600',
            2: 'from-slate-400 to-slate-500',
            3: 'from-amber-700 to-amber-800',
        };
        return colors[rank] || 'from-slate-600 to-slate-700';
    };

    return (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                    </div>
                    Top 3 Days by Expenditure
                </CardTitle>
                <p className="text-sm text-slate-400">Each user's highest spending days</p>
            </CardHeader>
            <CardContent>
                {Object.keys(groupedByUser).length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No data available</p>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedByUser).map(([userId, items]) => (
                            <div key={userId} className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                                    <User className="h-4 w-4 text-emerald-400" />
                                    <span className="font-medium text-white">{items[0].user_name}</span>
                                </div>
                                <div className="space-y-2">
                                    {items.map((item) => (
                                        <div
                                            key={`${item.user_id}-${item.date}`}
                                            className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRankBadge(item.rank)} flex items-center justify-center text-white text-sm font-bold`}>
                                                    {item.rank}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Calendar className="h-4 w-4 text-slate-500" />
                                                    {format(new Date(item.date), 'PPP')}
                                                </div>
                                            </div>
                                            <div className="flex items-center text-emerald-400 font-semibold">
                                                <IndianRupee className="h-4 w-4" />
                                                {Number(item.total_amount).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

