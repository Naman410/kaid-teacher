
-- Fix the get_teacher_classes function to ensure it works properly
CREATE OR REPLACE FUNCTION public.get_teacher_classes(p_teacher_user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result JSON;
BEGIN
  -- Get teacher's classes with student counts and organization limits
  SELECT json_agg(
    json_build_object(
      'id', c.id,
      'name', c.name,
      'grade_level', c.grade_level,
      'student_count', COALESCE(student_counts.count, 0),
      'organization_name', o.name,
      'daily_limit_per_student', o.daily_limit_per_student,
      'monthly_limit_per_student', o.monthly_limit_per_student,
      'package_type', o.package_type,
      'created_at', c.created_at
    )
  ) INTO result
  FROM public.classes c
  JOIN public.teachers t ON c.teacher_id = t.id
  JOIN public.organizations o ON c.organization_id = o.id
  LEFT JOIN (
    SELECT class_id, COUNT(*) as count
    FROM public.student_enrollments
    WHERE is_active = true
    GROUP BY class_id
  ) student_counts ON c.id = student_counts.class_id
  WHERE t.user_id = p_teacher_user_id 
    AND c.is_active = true
    AND t.is_active = true;

  RETURN COALESCE(result, '[]'::json);
END;
$function$
