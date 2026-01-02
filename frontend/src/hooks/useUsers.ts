import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: usersApi.getAll,
    });
};

export const useActiveUsers = () => {
    return useQuery({
        queryKey: ['users', 'active'],
        queryFn: usersApi.getActive,
    });
};

