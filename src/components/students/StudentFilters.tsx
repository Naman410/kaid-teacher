
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { memo } from 'react';

interface StudentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  filterByUsage: string;
  onFilterByUsageChange: (value: string) => void;
}

export const StudentFilters = memo(({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  filterByUsage, 
  onFilterByUsageChange 
}: StudentFiltersProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students or classes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="class">Class</SelectItem>
            <SelectItem value="usage">Usage</SelectItem>
            <SelectItem value="joined">Recently Joined</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterByUsage} onValueChange={onFilterByUsageChange}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by usage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="high">High Usage</SelectItem>
            <SelectItem value="low">Low Usage</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </Card>
));

StudentFilters.displayName = 'StudentFilters';
