
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTeacherStudents } from '@/hooks/useTeacherData';
import { useDebounce } from '@/hooks/useDebounce';
import { useFilteredStudents } from '@/hooks/useFilteredData';
import { PaginatedStudentsTable } from '@/components/students/PaginatedStudentsTable';
import { StudentFilters } from '@/components/students/StudentFilters';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Students() {
  const [searchParams] = useSearchParams();
  const classId = searchParams.get('classId') || undefined;
  const { data: students, isLoading } = useTeacherStudents(classId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterByUsage, setFilterByUsage] = useState('all');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredStudents = useFilteredStudents(students, debouncedSearchTerm, sortBy, filterByUsage);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">Monitor student activity and usage</p>
          </div>
          
          <Skeleton className="h-24" />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
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
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            Monitor student activity and usage across {classId ? 'this class' : 'all classes'}
          </p>
        </div>

        <StudentFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterByUsage={filterByUsage}
          onFilterByUsageChange={setFilterByUsage}
        />

        {filteredStudents.length === 0 && students && students.length > 0 ? (
          <Card>
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground">No students found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          <PaginatedStudentsTable students={filteredStudents} />
        )}
      </div>
    </DashboardLayout>
  );
}
