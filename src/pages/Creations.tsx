
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStudentCreations } from '@/hooks/useTeacherData';
import { useDebounce } from '@/hooks/useDebounce';
import { useFilteredCreations } from '@/hooks/useFilteredData';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { CreationFilters } from '@/components/creations/CreationFilters';
import { CreationCard } from '@/components/creations/CreationCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Creations() {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId') || undefined;
  const classId = searchParams.get('classId') || undefined;
  const { data: creations, isLoading } = useStudentCreations(studentId, classId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredCreations = useFilteredCreations(creations, debouncedSearchTerm, filterType, sortBy);

  const {
    displayedData,
    loading: infiniteLoading,
    hasMoreToShow,
    loadMore,
  } = useInfiniteScroll({
    data: filteredCreations,
    itemsPerPage: 12,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Creations</h1>
            <p className="text-muted-foreground">Explore student AI creations</p>
          </div>
          
          <Skeleton className="h-24" />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Creations</h1>
          <p className="text-muted-foreground">
            Explore student AI creations {studentId ? 'for this student' : classId ? 'from this class' : 'from all classes'}
          </p>
        </div>

        <CreationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {filteredCreations.length === 0 && creations && creations.length > 0 ? (
          <Card>
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground">No creations found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedData.map((creation) => (
                <CreationCard key={creation.id} creation={creation} />
              ))}
            </div>
            
            {hasMoreToShow && (
              <div className="text-center py-6">
                <Button 
                  onClick={loadMore} 
                  disabled={infiniteLoading}
                  variant="outline"
                  size="lg"
                >
                  {infiniteLoading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
