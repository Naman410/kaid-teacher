
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { useTeacherClasses, useTeacherStudents, useStudentCreations } from '@/hooks/useTeacherData';
import { Users, GraduationCap, ImageIcon, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { data: classes, isLoading: classesLoading } = useTeacherClasses();
  const { data: students, isLoading: studentsLoading } = useTeacherStudents();
  const { data: creations, isLoading: creationsLoading } = useStudentCreations();

  if (classesLoading || studentsLoading || creationsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your classes and students.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalClasses = classes?.length || 0;
  const totalStudents = students?.length || 0;
  const totalCreations = creations?.length || 0;
  
  const mostActiveClass = classes?.reduce((prev, current) => 
    (prev.student_count > current.student_count) ? prev : current
  )?.name || 'N/A';

  const todayCreations = creations?.filter(creation => {
    const today = new Date();
    const creationDate = new Date(creation.created_at);
    return creationDate.toDateString() === today.toDateString();
  }).length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your classes and students.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Classes"
            value={totalClasses}
            icon={GraduationCap}
            description="Active classes"
          />
          <StatsCard
            title="Total Students"
            value={totalStudents}
            icon={Users}
            description="Enrolled students"
          />
          <StatsCard
            title="Total Creations"
            value={totalCreations}
            icon={ImageIcon}
            description="All-time creations"
          />
          <StatsCard
            title="Today's Creations"
            value={todayCreations}
            icon={TrendingUp}
            description="Created today"
          />
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Most Active Class */}
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

          {/* Recent Activity */}
          <RecentActivity creations={creations || []} />
        </div>
      </div>
    </DashboardLayout>
  );
}
