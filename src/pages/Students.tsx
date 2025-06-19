
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UsageIndicator } from '@/components/dashboard/UsageIndicator';
import { useTeacherStudents } from '@/hooks/useTeacherData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, BarChart3 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export default function Students() {
  const [searchParams] = useSearchParams();
  const classId = searchParams.get('classId') || undefined;
  const { data: students, isLoading } = useTeacherStudents(classId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterByUsage, setFilterByUsage] = useState('all');

  const filteredAndSortedStudents = useMemo(() => {
    if (!students) return [];

    let filtered = students.filter(student => 
      student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by usage status
    if (filterByUsage === 'high') {
      filtered = filtered.filter(student => 
        (student.daily_usage / student.daily_limit) >= 0.8 ||
        (student.monthly_usage / student.monthly_limit) >= 0.8
      );
    } else if (filterByUsage === 'low') {
      filtered = filtered.filter(student => 
        (student.daily_usage / student.daily_limit) < 0.3 &&
        (student.monthly_usage / student.monthly_limit) < 0.3
      );
    }

    // Sort students
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.username.localeCompare(b.username);
        case 'class':
          return a.class_name.localeCompare(b.class_name);
        case 'usage':
          return (b.daily_usage + b.monthly_usage) - (a.daily_usage + a.monthly_usage);
        case 'joined':
          return new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime();
        default:
          return 0;
      }
    });
  }, [students, searchTerm, sortBy, filterByUsage]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">Monitor student activity and usage</p>
          </div>
          
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

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students or classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="class">Class</SelectItem>
                  <SelectItem value="usage">Usage</SelectItem>
                  <SelectItem value="joined">Recently Joined</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterByUsage} onValueChange={setFilterByUsage}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by usage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="high">High Usage</SelectItem>
                  <SelectItem value="low">Low Usage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        {filteredAndSortedStudents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground">
                {searchTerm ? 'No students found matching your search.' : 'No students found.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
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
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
