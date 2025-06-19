
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { memo } from 'react';

interface CreationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export const CreationFilters = memo(({ 
  searchTerm, 
  onSearchChange, 
  filterType, 
  onFilterTypeChange, 
  sortBy, 
  onSortChange 
}: CreationFiltersProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student or class..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={filterType} onValueChange={onFilterTypeChange}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="story">Stories</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="student">Student Name</SelectItem>
            <SelectItem value="type">Creation Type</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </Card>
));

CreationFilters.displayName = 'CreationFilters';
