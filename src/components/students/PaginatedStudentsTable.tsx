
import React, { memo } from 'react';
import { Student } from '@/types/teacher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { UsageIndicator } from '@/components/dashboard/UsageIndicator';
import { usePagination } from '@/hooks/usePagination';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

interface PaginatedStudentsTableProps {
  students: Student[];
}

const StudentCard = memo(({ student }: { student: Student }) => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={student.avatar_url} alt={student.username} />
            <AvatarFallback>{student.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{student.username}</CardTitle>
            <p className="text-sm text-muted-foreground">{student.class_name}</p>
          </div>
        </div>
        <Badge variant="outline">
          {student.total_creations} creations
        </Badge>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-4">
      <UsageIndicator
        current={student.daily_usage}
        limit={student.daily_limit}
        label="Daily Usage"
        type="daily"
      />
      
      <UsageIndicator
        current={student.monthly_usage}
        limit={student.monthly_limit}
        label="Monthly Usage"
        type="monthly"
      />
      
      <div className="flex space-x-2">
        <Button asChild size="sm" className="flex-1">
          <Link to={`/creations?studentId=${student.id}`}>
            View Creations
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
));

StudentCard.displayName = 'StudentCard';

export const PaginatedStudentsTable = memo(({ students }: PaginatedStudentsTableProps) => {
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = usePagination({ data: students, itemsPerPage: 12 });

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-muted-foreground">No students found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedData.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={goToPreviousPage}
                disabled={!hasPreviousPage}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => goToPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            {totalPages > 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={goToNextPage}
                disabled={!hasNextPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
});

PaginatedStudentsTable.displayName = 'PaginatedStudentsTable';
