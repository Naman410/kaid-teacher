
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { useTeacherClasses, useTeacherStudents, useStudentCreations } from '@/hooks/useTeacherData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OptimizedStatsGrid } from '@/components/dashboard/OptimizedStatsGrid';
import { ProgressiveLoader } from '@/components/ui/progressive-loader';
import { useMemo, memo } from 'react';

// Memoized components for better performance
const MostActiveClassCard = memo(({ classesData, isLoading }: { classesData: any; isLoading: boolean }) => {
  const mostActiveClass = useMemo(() => {
    if (!classesData || classesData.length === 0) return 'N/A';
    return classesData.reduce((prev: any, current: any) => 
      (prev.student_count > current.student_count) ? prev : current
    )?.name || 'N/A';
  }, [classesData]);

  return (
    <ProgressiveLoader
      isLoading={isLoading}
      skeleton={<Skeleton className="h-40" />}
      delay={400}
    >
      <Card>
        <CardHeader>
          <CardTitle>Most Active Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mostActiveClass}</div>
          <p className="text-muted-foreground">
            Your largest class by student count
          </p>
        </CardContent>
      </Card>
    </ProgressiveLoader>
  );
});

MostActiveClassCard.displayName = 'MostActiveClassCard';

const RecentActivityCard = memo(({ creationsData, isLoading }: { creationsData: any; isLoading: boolean }) => (
  <ProgressiveLoader
    isLoading={isLoading}
    skeleton={<Skeleton className="h-40" />}
    delay={500}
  >
    <RecentActivity creations={creationsData || []} />
  </ProgressiveLoader>
));

RecentActivityCard.displayName = 'RecentActivityCard';

export default function Dashboard() {
  const { data: classes, isLoading: classesLoading } = useTeacherClasses();
  const { data: students, isLoading: studentsLoading } = useTeacherStudents();
  const { data: creations, isLoading: creationsLoading } = useStudentCreations();

  // Memoize today's creations calculation
  const todayCreations = useMemo(() => {
    if (!creations) return 0;
    const today = new Date();
    return creations.filter((creation: any) => {
      const creationDate = new Date(creation.created_at);
      return creationDate.toDateString() === today.toDateString();
    }).length;
  }, [creations]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your classes and students.
          </p>
        </div>
        
        {/* Progressive Stats Cards */}
        <OptimizedStatsGrid
          classesData={classes}
          studentsData={students}
          creationsData={creations}
          todayCreations={todayCreations}
          classesLoading={classesLoading}
          studentsLoading={studentsLoading}
          creationsLoading={creationsLoading}
        />

        {/* Progressive Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <MostActiveClassCard 
            classesData={classes} 
            isLoading={classesLoading} 
          />
          <RecentActivityCard 
            creationsData={creations} 
            isLoading={creationsLoading} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
