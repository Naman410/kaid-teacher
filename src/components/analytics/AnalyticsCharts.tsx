
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useMemo, memo } from 'react';
import { TeacherClass, Student, StudentCreation } from '@/types/teacher';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface AnalyticsChartsProps {
  classes: TeacherClass[];
  students: Student[];
  creations: StudentCreation[];
}

const ClassesChart = memo(({ classes }: { classes: TeacherClass[] }) => {
  const classData = useMemo(() => 
    classes.map(cls => ({
      name: cls.name,
      students: cls.student_count,
      dailyLimit: cls.daily_limit_per_student,
      monthlyLimit: cls.monthly_limit_per_student,
    })).slice(0, 10), // Limit to top 10 for performance
  [classes]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Students per Class</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={classData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="students" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

const CreationTypesChart = memo(({ creations }: { creations: StudentCreation[] }) => {
  const creationTypeData = useMemo(() => {
    const creationTypes = creations.reduce((acc, creation) => {
      acc[creation.creation_type] = (acc[creation.creation_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(creationTypes).map(([type, count]) => ({
      name: type,
      value: count,
    }));
  }, [creations]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creation Types Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={creationTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {creationTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

const DailyTrendsChart = memo(({ creations }: { creations: StudentCreation[] }) => {
  const dailyTrends = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayCreations = creations.filter(creation => 
        creation.created_at.startsWith(date)
      ).length;
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        creations: dayCreations,
      };
    });
  }, [creations]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creation Trends (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="creations" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

const UsageChart = memo(({ students }: { students: Student[] }) => {
  // This helper function safely calculates the percentage, handling all edge cases.
  const calculatePercentage = (value?: number, limit?: number) => {
    // Guards against null, undefined, or non-numeric inputs
    if (typeof value !== 'number' || typeof limit !== 'number' || limit === 0) {
      return 0;
    }
    const percentage = (value / limit) * 100;
    // Guards against results like NaN (from 0/0) or Infinity (from X/0)
    return isFinite(percentage) ? percentage : 0;
  };

  const usageData = useMemo(() =>
    students.map(student => ({
      name: student.username,
      dailyUsage: calculatePercentage(student.daily_usage, student.daily_limit),
      monthlyUsage: calculatePercentage(student.monthly_usage, student.monthly_limit),
    })).slice(0, 10), // Top 10 students for performance
  [students]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Student Usage (% of Limits)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={usageData} layout="horizontal">
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
  );
});

ClassesChart.displayName = 'ClassesChart';
CreationTypesChart.displayName = 'CreationTypesChart';
DailyTrendsChart.displayName = 'DailyTrendsChart';
UsageChart.displayName = 'UsageChart';

export function AnalyticsCharts({ classes, students, creations }: AnalyticsChartsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ClassesChart classes={classes} />
      <CreationTypesChart creations={creations} />
      <DailyTrendsChart creations={creations} />
      <UsageChart students={students} />
    </div>
  );
}
