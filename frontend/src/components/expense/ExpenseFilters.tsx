import { format } from 'date-fns';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import type { ExpenseFilters as ExpenseFiltersType } from '@/types';
import { cn } from '@/lib/utils';

interface ExpenseFiltersProps {
    filters: ExpenseFiltersType;
    onFiltersChange: (filters: ExpenseFiltersType) => void;
}

const ALL_VALUE = 'all';

export function ExpenseFilters({ filters, onFiltersChange }: ExpenseFiltersProps) {
    const { data: users } = useActiveUsers();
    const { data: categories } = useCategories();

    const handleClearFilters = () => {
        onFiltersChange({
            user_id: '',
            category_id: '',
            start_date: '',
            end_date: '',
        });
    };

    const hasActiveFilters = 
        filters.user_id || 
        filters.category_id || 
        filters.start_date || 
        filters.end_date;

    const handleUserChange = (value: string) => {
        onFiltersChange({ 
            ...filters, 
            user_id: value === ALL_VALUE ? '' : parseInt(value) 
        });
    };

    const handleCategoryChange = (value: string) => {
        onFiltersChange({ 
            ...filters, 
            category_id: value === ALL_VALUE ? '' : parseInt(value) 
        });
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-emerald-400" />
                <h3 className="font-semibold text-white">Filter Expenses</h3>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="ml-auto text-slate-400 hover:text-white"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                    </Button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* User Filter */}
                <div>
                    <label className="text-sm text-slate-400 mb-2 block">User</label>
                    <Select
                        value={filters.user_id ? filters.user_id.toString() : ALL_VALUE}
                        onValueChange={handleUserChange}
                    >
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                            <SelectValue placeholder="All Users" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value={ALL_VALUE} className="text-white">All Users</SelectItem>
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
                </div>

                {/* Category Filter */}
                <div>
                    <label className="text-sm text-slate-400 mb-2 block">Category</label>
                    <Select
                        value={filters.category_id ? filters.category_id.toString() : ALL_VALUE}
                        onValueChange={handleCategoryChange}
                    >
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value={ALL_VALUE} className="text-white">All Categories</SelectItem>
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
                </div>

                {/* Start Date Filter */}
                <div>
                    <label className="text-sm text-slate-400 mb-2 block">Start Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    'w-full justify-start text-left font-normal bg-slate-900/50 border-slate-600 text-white hover:bg-slate-700',
                                    !filters.start_date && 'text-slate-400'
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {filters.start_date ? format(new Date(filters.start_date), 'PPP') : 'Pick date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                            <Calendar
                                mode="single"
                                selected={filters.start_date ? new Date(filters.start_date) : undefined}
                                onSelect={(date) => {
                                    onFiltersChange({
                                        ...filters,
                                        start_date: date ? format(date, 'yyyy-MM-dd') : ''
                                    });
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* End Date Filter */}
                <div>
                    <label className="text-sm text-slate-400 mb-2 block">End Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    'w-full justify-start text-left font-normal bg-slate-900/50 border-slate-600 text-white hover:bg-slate-700',
                                    !filters.end_date && 'text-slate-400'
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {filters.end_date ? format(new Date(filters.end_date), 'PPP') : 'Pick date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                            <Calendar
                                mode="single"
                                selected={filters.end_date ? new Date(filters.end_date) : undefined}
                                onSelect={(date) => {
                                    onFiltersChange({
                                        ...filters,
                                        end_date: date ? format(date, 'yyyy-MM-dd') : ''
                                    });
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
}
