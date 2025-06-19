
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { TeacherClass } from '@/types/teacher';

interface ClassCardProps {
  classItem: TeacherClass;
}

const getPackageColor = (packageType: string) => {
  switch (packageType) {
    case 'pro': return 'bg-purple-100 text-purple-800';
    case 'starter': return 'bg-blue-100 text-blue-800';
    case 'basic': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const ClassCard = memo(({ classItem }: ClassCardProps) => {
  const formattedDate = React.useMemo(() => 
    formatDistanceToNow(new Date(classItem.created_at), { addSuffix: true }),
    [classItem.created_at]
  );

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
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
            {formattedDate}
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
  );
});

ClassCard.displayName = 'ClassCard';
