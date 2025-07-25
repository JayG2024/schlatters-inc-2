import { createClient } from 'jsr:@supabase/supabase-js@2';
Deno.serve(async (req)=>{
  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: 'Missing Authorization header'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    // Create a Supabase client using the user's JWT
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'), {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });
    // Get the user's session
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({
        error: 'Unauthorized or invalid session'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    // Check if email is verified
    const isEmailVerified = user.email_confirmed_at !== null;
    // Get app settings to check if email verification is required
    const { data: settings, error: settingsError } = await supabaseClient.from('app_settings').select('require_email_verification').single();
    // Default to requiring verification if settings can't be fetched
    const requireVerification = settingsError ? true : settings?.require_email_verification ?? true;
    // Determine if the user should be allowed access
    const allowAccess = isEmailVerified || !requireVerification;
    return new Response(JSON.stringify({
      email: user.email,
      isEmailVerified,
      requireVerification,
      allowAccess
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
});
