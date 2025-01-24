import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateUserPayload {
  email: string;
  password: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
}

interface DeleteUserPayload {
  user_id: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Creating Supabase client...')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { method, action } = await req.json()
    console.log(`Received request with method: ${method}`)

    if (method === 'CREATE') {
      const payload = action as CreateUserPayload
      console.log('Creating new user with email:', payload.email)
      
      // Create user in auth.users
      const { data: authUser, error: createError } = await supabaseClient.auth.admin.createUser({
        email: payload.email,
        password: payload.password,
        email_confirm: true
      })

      if (createError) {
        console.error('Error creating auth user:', createError)
        throw createError
      }
      console.log('Auth user created successfully:', authUser.user.id)

      // Update profile
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .update({
          first_name: payload.first_name,
          last_name: payload.last_name
        })
        .eq('id', authUser.user.id)

      if (profileError) {
        console.error('Error updating profile:', profileError)
        throw profileError
      }
      console.log('Profile updated successfully')

      // Set admin role if needed
      if (payload.is_admin) {
        console.log('Setting admin role for user')
        const { error: roleError } = await supabaseClient
          .from('user_roles')
          .update({ role: 'admin' })
          .eq('user_id', authUser.user.id)

        if (roleError) {
          console.error('Error setting admin role:', roleError)
          throw roleError
        }
        console.log('Admin role set successfully')
      }

      return new Response(
        JSON.stringify({ message: 'User created successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'DELETE') {
      const payload = action as DeleteUserPayload
      console.log('Attempting to delete user:', payload.user_id)

      // First verify the user exists
      const { data: user, error: getUserError } = await supabaseClient.auth.admin.getUserById(
        payload.user_id
      )

      if (getUserError) {
        console.error('Error fetching user:', getUserError)
        throw getUserError
      }

      if (!user) {
        console.error('User not found:', payload.user_id)
        throw new Error('User not found')
      }

      console.log('User found, proceeding with deletion')

      // Delete the user from auth.users
      const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(
        payload.user_id
      )

      if (deleteError) {
        console.error('Error deleting user:', deleteError)
        throw deleteError
      }

      console.log('User deleted successfully')

      return new Response(
        JSON.stringify({ message: 'User deleted successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.error('Invalid method received:', method)
    throw new Error('Invalid method')

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.details || 'No additional details available'
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})