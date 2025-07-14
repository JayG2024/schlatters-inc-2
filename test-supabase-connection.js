import { createClient } from '@supabase/supabase-js';

// Test your Supabase connection
async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing environment variables!');
    console.log('Please run: npm run setup:supabase');
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test 1: Check if we can connect
    console.log('✅ Supabase client created successfully');
    console.log(`📍 Connected to: ${supabaseUrl}\n`);
    
    // Test 2: Try to fetch from auth
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Auth error:', error.message);
    } else {
      console.log('✅ Auth system is accessible');
      console.log(`📊 Current session: ${session ? 'Active' : 'None'}\n`);
    }
    
    // Test 3: Try to query profiles table
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (profileError) {
      if (profileError.message.includes('relation "public.profiles" does not exist')) {
        console.log('⚠️  Tables not created yet');
        console.log('📝 Please run the migration in Supabase SQL Editor');
      } else {
        console.error('❌ Database error:', profileError.message);
      }
    } else {
      console.log('✅ Database tables exist and are accessible');
    }
    
    console.log('\n🎉 Connection test complete!');
    
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

// Load env vars if running directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const dotenv = await import('dotenv');
  dotenv.config({ path: '.env.local' });
  testConnection();
}