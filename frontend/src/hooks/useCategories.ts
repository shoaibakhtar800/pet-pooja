import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api';

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: categoriesApi.getAll,
    });
};

