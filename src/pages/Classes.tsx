
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTeacherClasses } from '@/hooks/useTeacherData';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ClassCard } from '@/components/classes/ClassCard';
import { ProgressiveLoader } from '@/components/ui/progressive-loader';
import { memo } from 'react';

// Memoized skeleton grid for better performance
const ClassesSkeletonGrid = memo(() => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[...Array(6)].map((_, i) => (
      <Skeleton key={i} className="h-64" />
    ))}
  </div>
));

ClassesSkeletonGrid.displayName = 'ClassesSkeletonGrid';

// Memoized empty state
const EmptyState = memo(() => (
  <Card>
    <CardContent className="text-center py-10">
      <p className="text-muted-foreground">No classes found. Contact your administrator to get started.</p>
    </CardContent>
  </Card>
));

EmptyState.displayName = 'EmptyState';

// Memoized error state
const ErrorState = memo(() => (
  <Card>
    <CardContent className="text-center py-10">
      <p className="text-destructive">Failed to load classes. Please try again.</p>
    </CardContent>
  </Card>
));

ErrorState.displayName = 'ErrorState';

export default function Classes() {
  const { data: classes, isLoading, error } = useTeacherClasses();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Classes</h1>
          <p className="text-muted-foreground">Manage your classes and monitor student activity</p>
        </div>

        <ProgressiveLoader
          isLoading={isLoading}
          hasError={!!error}
          skeleton={<ClassesSkeletonGrid />}
        >
          {!classes || classes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </div>
          )}
        </ProgressiveLoader>

        {error && <ErrorState />}
      </div>
    </DashboardLayout>
  );
}
