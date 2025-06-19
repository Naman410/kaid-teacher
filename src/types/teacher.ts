
export interface TeacherClass {
  id: string;
  name: string;
  grade_level: string;
  student_count: number;
  organization_name: string;
  daily_limit_per_student: number;
  monthly_limit_per_student: number;
  package_type: 'basic' | 'starter' | 'pro';
  created_at: string;
}

export interface Student {
  id: string;
  username: string;
  avatar_url: string;
  class_name: string;
  class_id: string;
  daily_usage: number;
  monthly_usage: number;
  daily_limit: number;
  monthly_limit: number;
  enrolled_at: string;
  total_creations: number;
}

export interface StudentCreation {
  id: string;
  user_id: string;
  creation_type: 'image' | 'music' | 'story';
  creation_data: any;
  created_at: string;
  username: string;
  class_name: string;
}

export interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  totalCreations: number;
  mostActiveClass?: string;
}
