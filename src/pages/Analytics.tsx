
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTeacherClasses, useTeacherStudents, useStudentCreations } from '@/hooks/useTeacherData';
import { Card, CardContent } from '@/components/ui/card';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { Skeleton } from '@/components/ui/skeleton';

export default function Analytics() {
  const { data: classes, isLoading: classesLoading } = useTeacherClasses();
  const { data: students, isLoading: studentsLoading } = useTeacherStudents();
  const { data: creations, isLoading: creationsLoading } = useStudentCreations();

  const isLoading = classesLoading || studentsLoading || creationsLoading;
  const hasData = classes && students && creations;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Insights and usage analytics across your classes
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : !hasData ? (
          <Card>
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground">No data available for analytics.</p>
            </CardContent>
          </Card>
        ) : (
          <AnalyticsCharts 
            classes={classes}
            students={students}
            creations={creations}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
