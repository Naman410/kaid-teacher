
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('Teacher Dashboard API Error: No authorization header')
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify the user's session
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Teacher Dashboard API Error: Invalid token', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    let body
    try {
      body = await req.json()
    } catch (e) {
      console.error('Teacher Dashboard API Error: Failed to parse JSON body', e)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { endpoint, ...params } = body
    
    console.log('Teacher Dashboard API Request:', { endpoint, params, userId: user.id })

    if (!endpoint) {
      console.error('Teacher Dashboard API Error: No endpoint provided')
      return new Response(
        JSON.stringify({ error: 'Endpoint parameter is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let result
    
    switch (endpoint) {
      case 'classes':
        console.log('Fetching teacher classes for user:', user.id)
        const { data: classesData, error: classesError } = await supabase
          .rpc('get_teacher_classes', { p_teacher_user_id: user.id })
        
        if (classesError) {
          console.error('Teacher Dashboard API Error (classes):', classesError)
          throw classesError
        }
        
        result = classesData || []
        break

      case 'students':
        console.log('Fetching teacher students for user:', user.id, 'classId:', params.classId)
        const { data: studentsData, error: studentsError } = await supabase
          .rpc('get_teacher_students', { 
            p_teacher_user_id: user.id,
            p_class_id: params.classId || null
          })
        
        if (studentsError) {
          console.error('Teacher Dashboard API Error (students):', studentsError)
          throw studentsError
        }
        
        result = studentsData || []
        break

      case 'creations':
        console.log('Fetching student creations for user:', user.id, 'studentId:', params.studentId, 'classId:', params.classId)
        const { data: creationsData, error: creationsError } = await supabase
          .rpc('get_student_creations', { 
            p_teacher_user_id: user.id,
            p_student_id: params.studentId || null,
            p_class_id: params.classId || null
          })
        
        if (creationsError) {
          console.error('Teacher Dashboard API Error (creations):', creationsError)
          throw creationsError
        }
        
        result = creationsData || []
        break

      default:
        console.error('Teacher Dashboard API Error: Unknown endpoint:', endpoint)
        return new Response(
          JSON.stringify({ error: `Unknown endpoint: ${endpoint}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

    console.log('Teacher Dashboard API Success:', { endpoint, resultCount: Array.isArray(result) ? result.length : 'N/A' })

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Teacher Dashboard API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
