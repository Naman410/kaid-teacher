
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
  });
};

export const useTeacherStudents = (classId?: string) => {
  return useQuery({
    queryKey: ['teacher-students', classId],
    queryFn: () => fetchTeacherData('students', classId ? { classId } : undefined),
  });
};

export const useStudentCreations = (studentId?: string, classId?: string) => {
  return useQuery({
    queryKey: ['student-creations', studentId, classId],
    queryFn: () => fetchTeacherData('creations', { 
      ...(studentId && { studentId }), 
      ...(classId && { classId }) 
    }),
  });
};
