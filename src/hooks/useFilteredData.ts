
import { useMemo } from 'react';
import { Student, StudentCreation } from '@/types/teacher';

export const useFilteredStudents = (
  students: Student[] | undefined,
  searchTerm: string,
  sortBy: string,
  filterByUsage: string
) => {
  return useMemo(() => {
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
};

export const useFilteredCreations = (
  creations: StudentCreation[] | undefined,
  searchTerm: string,
  filterType: string,
  sortBy: string
) => {
  return useMemo(() => {
    if (!creations) return [];

    let filtered = creations.filter(creation => 
      creation.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creation.class_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by creation type
    if (filterType !== 'all') {
      filtered = filtered.filter(creation => creation.creation_type === filterType);
    }

    // Sort creations
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'student':
          return a.username.localeCompare(b.username);
        case 'type':
          return a.creation_type.localeCompare(b.creation_type);
        default:
          return 0;
      }
    });
  }, [creations, searchTerm, filterType, sortBy]);
};
