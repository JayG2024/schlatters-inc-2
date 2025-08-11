import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { supabase, clientsApi } from '../../lib/supabase';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const DebugPage: React.FC = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  
  const runTests = async () => {
    setLoading(true);
    const results: any = {};
    
    // Test 1: Check Supabase connection
    try {
      const { data, error } = await supabase.from('clients').select('count').single();
      results.connection = error ? { success: false, error: error.message } : { success: true, data };
    } catch (error: any) {
      results.connection = { success: false, error: error.message };
    }
    
    // Test 2: Try to fetch clients
    try {
      const data = await clientsApi.getAll();
      results.fetchClients = { success: true, count: data?.length || 0 };
    } catch (error: any) {
      results.fetchClients = { success: false, error: error.message };
    }
    
    // Test 3: Try to create a test client
    try {
      const testClient = {
        name: 'Test Client ' + Date.now(),
        phone: '+1 (555) 000-' + Math.floor(Math.random() * 10000),
        company: 'Test Company',
        email: 'test@example.com',
        status: 'active',
        is_subscriber: false,
        total_revenue: 0,
        outstanding_balance: 0,
        lifetime_value: 0,
        total_calls: 0,
        total_messages: 0,
        purchase_count: 0
      };
      
      const { data, error } = await supabase.from('clients').insert(testClient).select().single();
      
      if (error) {
        results.createClient = { success: false, error: error.message, details: error };
      } else {
        results.createClient = { success: true, data };
        
        // Clean up - delete the test client
        await supabase.from('clients').delete().eq('id', data.id);
      }
    } catch (error: any) {
      results.createClient = { success: false, error: error.message };
    }
    
    // Test 4: Check environment variables
    results.envVars = {
      VITE_SUPABASE_URL: !!import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      // Don't expose actual URL in production
      url: import.meta.env.DEV ? import.meta.env.VITE_SUPABASE_URL : (import.meta.env.VITE_SUPABASE_URL ? '***HIDDEN***' : 'Not Set'),
    };
    
    setTestResults(results);
    setLoading(false);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Debug Supabase Connection
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Test your Supabase connection and troubleshoot issues
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Connection Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runTests} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Running Tests...
              </>
            ) : (
              'Run Tests'
            )}
          </Button>
          
          {Object.entries(testResults).length > 0 && (
            <div className="mt-6 space-y-4">
              {Object.entries(testResults).map(([test, result]: [string, any]) => (
                <div key={test} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium capitalize">{test.replace(/([A-Z])/g, ' $1').trim()}</h3>
                    {result.success ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <XCircle className="text-red-600" size={20} />
                    )}
                  </div>
                  <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            If the Add Client button isn't working, try these steps:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Run the RLS policies update in Supabase SQL Editor (002_update_rls_policies.sql)</li>
            <li>Check the browser console for errors (F12 → Console)</li>
            <li>Verify environment variables are set in Vercel</li>
            <li>Make sure the database migration ran successfully</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugPage;