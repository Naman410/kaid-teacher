
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TeacherClass, Student, StudentCreation } from '@/types/teacher';

const fetchTeacherData = async (endpoint: string, params?: Record<string, string>) => {
  const { data, error } = await supabase.functions.invoke('teacher-dashboard', {
    body: { 
      endpoint,
      ...params 
    }
  });
  
  if (error) throw error;
  return data;
};

export const useTeacherClasses = () => {
  return useQuery({
    queryKey: ['teacher-classes'],
    queryFn: () => fetchTeacherData('classes'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useTeacherStudents = (classId?: string) => {
  return useQuery({
    queryKey: ['teacher-students', classId],
    queryFn: () => fetchTeacherData('students', classId ? { classId } : undefined),
    enabled: true, // Always enabled, will fetch all students if no classId
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useStudentCreations = (studentId?: string, classId?: string) => {
  return useQuery({
    queryKey: ['student-creations', studentId, classId],
    queryFn: () => fetchTeacherData('creations', { 
      ...(studentId && { studentId }), 
      ...(classId && { classId }) 
    }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// New optimized hook for dashboard stats only
export const useDashboardStats = () => {
  const { data: classes, isLoading: classesLoading } = useTeacherClasses();
  const { data: students, isLoading: studentsLoading } = useTeacherStudents();
  
  return useQuery({
    queryKey: ['dashboard-stats', classes, students],
    queryFn: () => {
      if (!classes || !students) return null;
      
      const totalClasses = classes.length;
      const totalStudents = students.length;
      const mostActiveClass = classes.reduce((prev, current) => 
        (prev.student_count > current.student_count) ? prev : current
      )?.name || 'N/A';
      
      return {
        totalClasses,
        totalStudents,
        mostActiveClass
      };
    },
    enabled: !classesLoading && !studentsLoading && !!classes && !!students,
    staleTime: 5 * 60 * 1000,
  });
};
