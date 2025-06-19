
-- Fix the get_teacher_students function by removing the problematic GROUP BY
CREATE OR REPLACE FUNCTION public.get_teacher_students(p_teacher_user_id uuid, p_class_id uuid DEFAULT NULL::uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result JSON;
BEGIN
  -- Get students with usage data and limits
  SELECT json_agg(
    json_build_object(
      'id', p.id,
      'username', p.username,
      'avatar_url', p.avatar_url,
      'class_name', c.name,
      'class_id', c.id,
      'daily_usage', COALESCE(daily.creations_count, 0),
      'monthly_usage', COALESCE(monthly.creations_count, 0),
      'daily_limit', o.daily_limit_per_student,
      'monthly_limit', o.monthly_limit_per_student,
      'enrolled_at', se.enrolled_at,
      'total_creations', p.total_creations_used
    )
  ) INTO result
  FROM public.profiles p
  JOIN public.student_enrollments se ON p.id = se.student_id
  JOIN public.classes c ON se.class_id = c.id
  JOIN public.teachers t ON c.teacher_id = t.id
  JOIN public.organizations o ON c.organization_id = o.id
  LEFT JOIN public.daily_usage_tracking daily ON p.id = daily.user_id AND daily.date = CURRENT_DATE
  LEFT JOIN public.monthly_usage_tracking monthly ON p.id = monthly.user_id 
    AND monthly.year = EXTRACT(YEAR FROM CURRENT_DATE)
    AND monthly.month = EXTRACT(MONTH FROM CURRENT_DATE)
  WHERE t.user_id = p_teacher_user_id 
    AND se.is_active = true
    AND (p_class_id IS NULL OR c.id = p_class_id)
  ORDER BY p.username;

  RETURN COALESCE(result, '[]'::json);
END;
$function$
