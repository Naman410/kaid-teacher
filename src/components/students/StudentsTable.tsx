
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UsageIndicator } from '@/components/dashboard/UsageIndicator';
import { Calendar, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Student } from '@/types/teacher';
import { memo } from 'react';

interface StudentsTableProps {
  students: Student[];
}

const StudentCard = memo(({ student }: { student: Student }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={student.avatar_url} alt={student.username} />
          <AvatarFallback>
            {student.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{student.username}</CardTitle>
          <p className="text-sm text-muted-foreground">{student.class_name}</p>
        </div>
      </div>
    </CardHeader>

    <CardContent className="space-y-4">
      <div className="space-y-3">
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
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center">
          <BarChart3 className="w-4 h-4 mr-1" />
          {student.total_creations} total
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {formatDistanceToNow(new Date(student.enrolled_at), { addSuffix: true })}
        </div>
      </div>

      <Button asChild className="w-full">
        <Link to={`/creations?studentId=${student.id}`}>
          View Creations
        </Link>
      </Button>
    </CardContent>
  </Card>
));

StudentCard.displayName = 'StudentCard';

export function StudentsTable({ students }: StudentsTableProps) {
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}
