
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTeacherClasses } from '@/hooks/useTeacherData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export default function Classes() {
  const { data: classes, isLoading } = useTeacherClasses();

  const getPackageColor = (packageType: string) => {
    switch (packageType) {
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'starter': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Classes</h1>
            <p className="text-muted-foreground">Manage your classes and monitor student activity</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
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
          <h1 className="text-3xl font-bold">Classes</h1>
          <p className="text-muted-foreground">
            Manage your classes and monitor student activity
          </p>
        </div>

        {classes?.length === 0 ? (
          <Card>
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground">No classes found. Contact your administrator to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes?.map((classItem) => (
              <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <Badge className={getPackageColor(classItem.package_type)}>
                      <Package className="w-3 h-3 mr-1" />
                      {classItem.package_type}
                    </Badge>
                  </div>
                  {classItem.grade_level && (
                    <p className="text-sm text-muted-foreground">
                      Grade {classItem.grade_level}
                    </p>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      {classItem.student_count} students
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDistanceToNow(new Date(classItem.created_at), { addSuffix: true })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Daily Limit:</span> {classItem.daily_limit_per_student}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Monthly Limit:</span> {classItem.monthly_limit_per_student}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Organization:</span> {classItem.organization_name}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button asChild className="w-full">
                      <Link to={`/students?classId=${classItem.id}`}>
                        View Students
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
