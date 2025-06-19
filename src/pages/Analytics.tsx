
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTeacherClasses, useTeacherStudents, useStudentCreations } from '@/hooks/useTeacherData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Analytics() {
  const { data: classes, isLoading: classesLoading } = useTeacherClasses();
  const { data: students, isLoading: studentsLoading } = useTeacherStudents();
  const { data: creations, isLoading: creationsLoading } = useStudentCreations();

  const analyticsData = useMemo(() => {
    if (!classes || !students || !creations) return null;

    // Class analytics
    const classData = classes.map(cls => ({
      name: cls.name,
      students: cls.student_count,
      dailyLimit: cls.daily_limit_per_student,
      monthlyLimit: cls.monthly_limit_per_student,
    }));

    // Creation type distribution
    const creationTypes = creations.reduce((acc, creation) => {
      acc[creation.creation_type] = (acc[creation.creation_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const creationTypeData = Object.entries(creationTypes).map(([type, count]) => ({
      name: type,
      value: count,
    }));

    // Daily creation trends (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyTrends = last7Days.map(date => {
      const dayCreations = creations.filter(creation => 
        creation.created_at.startsWith(date)
      ).length;
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        creations: dayCreations,
      };
    });

    // Usage analytics
    const usageData = students.map(student => ({
      name: student.username,
      dailyUsage: (student.daily_usage / student.daily_limit) * 100,
      monthlyUsage: (student.monthly_usage / student.monthly_limit) * 100,
    })).slice(0, 10); // Top 10 students

    return {
      classData,
      creationTypeData,
      dailyTrends,
      usageData,
    };
  }, [classes, students, creations]);

  if (classesLoading || studentsLoading || creationsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Insights and usage analytics</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analyticsData) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Insights and usage analytics</p>
          </div>
          <Card>
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground">No data available for analytics.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Insights and usage analytics across your classes
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Class Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Students per Class</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.classData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Creation Types */}
          <Card>
            <CardHeader>
              <CardTitle>Creation Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.creationTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.creationTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Creation Trends (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.dailyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="creations" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Usage Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Top Student Usage (% of Limits)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.usageData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="dailyUsage" fill="#f59e0b" name="Daily Usage %" />
                  <Bar dataKey="monthlyUsage" fill="#8b5cf6" name="Monthly Usage %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
