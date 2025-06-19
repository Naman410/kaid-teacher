
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { useTeacherClasses, useTeacherStudents, useStudentCreations, useDashboardStats } from '@/hooks/useTeacherData';
import { Users, GraduationCap, ImageIcon, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export default function Dashboard() {
  const { data: classes, isLoading: classesLoading } = useTeacherClasses();
  const { data: students, isLoading: studentsLoading } = useTeacherStudents();
  const { data: creations, isLoading: creationsLoading } = useStudentCreations();
  const { data: dashboardStats } = useDashboardStats();

  // Memoize today's creations calculation
  const todayCreations = useMemo(() => {
    if (!creations) return 0;
    const today = new Date();
    return creations.filter(creation => {
      const creationDate = new Date(creation.created_at);
      return creationDate.toDateString() === today.toDateString();
    }).length;
  }, [creations]);

  const totalCreations = creations?.length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your classes and students.
          </p>
        </div>
        
        {/* Stats Cards - Load independently */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {classesLoading ? (
            <Skeleton className="h-32" />
          ) : (
            <StatsCard
              title="Total Classes"
              value={dashboardStats?.totalClasses || classes?.length || 0}
              icon={GraduationCap}
              description="Active classes"
            />
          )}
          
          {studentsLoading ? (
            <Skeleton className="h-32" />
          ) : (
            <StatsCard
              title="Total Students"
              value={dashboardStats?.totalStudents || students?.length || 0}
              icon={Users}
              description="Enrolled students"
            />
          )}
          
          {creationsLoading ? (
            <Skeleton className="h-32" />
          ) : (
            <StatsCard
              title="Total Creations"
              value={totalCreations}
              icon={ImageIcon}
              description="All-time creations"
            />
          )}
          
          {creationsLoading ? (
            <Skeleton className="h-32" />
          ) : (
            <StatsCard
              title="Today's Creations"
              value={todayCreations}
              icon={TrendingUp}
              description="Created today"
            />
          )}
        </div>

        {/* Content Grid - Load independently */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Most Active Class */}
          {classesLoading ? (
            <Skeleton className="h-40" />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Most Active Class</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats?.mostActiveClass || 'N/A'}
                </div>
                <p className="text-muted-foreground">
                  Your largest class by student count
                </p>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          {creationsLoading ? (
            <Skeleton className="h-40" />
          ) : (
            <RecentActivity creations={creations || []} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
