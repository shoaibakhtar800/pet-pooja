import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '@/lib/api';

export const useAllStatistics = () => {
    return useQuery({
        queryKey: ['statistics'],
        queryFn: statisticsApi.getAll,
    });
};

export const useTopDaysExpenditure = () => {
    return useQuery({
        queryKey: ['statistics', 'top-days'],
        queryFn: statisticsApi.getTopDays,
    });
};

export const useMonthlyPercentageChange = () => {
    return useQuery({
        queryKey: ['statistics', 'monthly-change'],
        queryFn: statisticsApi.getMonthlyChange,
    });
};

export const usePredictedExpenditure = () => {
    return useQuery({
        queryKey: ['statistics', 'prediction'],
        queryFn: statisticsApi.getPrediction,
    });
};

