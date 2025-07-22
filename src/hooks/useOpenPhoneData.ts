import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Call {
  id: string;
  client_id: string;
  start_time: string;
  end_time: string;
  duration: number;
  status: string;
  direction: string;
  from_number: string;
  to_number: string;
  recording_url?: string;
  client?: {
    name: string;
    phone: string;
  };
}

interface Message {
  id: string;
  client_id: string;
  content: string;
  direction: string;
  status: string;
  from_number: string;
  to_number: string;
  created_at: string;
  client?: {
    name: string;
    phone: string;
  };
}

export function useOpenPhoneData() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch recent calls with client info
      const { data: callsData, error: callsError } = await supabase
        .from('calls')
        .select(`
          *,
          client:clients(name, phone)
        `)
        .order('start_time', { ascending: false })
        .limit(10);

      if (callsError) throw callsError;

      // Fetch recent messages with client info
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          client:clients(name, phone)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (messagesError) throw messagesError;

      setCalls(callsData || []);
      setMessages(messagesData || []);

    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching OpenPhone data:', err);
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    try {
      setSyncing(true);
      setError(null);

      const response = await fetch('/api/sync/openphone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to sync OpenPhone data');
      }

      const result = await response.json();
      console.log('Sync result:', result);

      // Refresh data after sync
      await fetchData();

      return result;

    } catch (err: any) {
      setError(err.message);
      console.error('Error syncing OpenPhone data:', err);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscriptions
    const callsSubscription = supabase
      .channel('calls-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'calls' 
      }, () => {
        fetchData();
      })
      .subscribe();

    const messagesSubscription = supabase
      .channel('messages-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages' 
      }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      callsSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
    };
  }, []);

  return {
    calls,
    messages,
    loading,
    error,
    syncing,
    syncData,
    refetch: fetchData
  };
}

export function useCallStatistics() {
  const [stats, setStats] = useState({
    totalCalls: 0,
    totalDuration: 0,
    averageDuration: 0,
    inboundCalls: 0,
    outboundCalls: 0,
    missedCalls: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const { data: calls, error } = await supabase
          .from('calls')
          .select('duration, direction, status');

        if (error) throw error;

        if (calls && calls.length > 0) {
          const totalCalls = calls.length;
          const totalDuration = calls.reduce((sum, call) => sum + (call.duration || 0), 0);
          const averageDuration = totalDuration / totalCalls;
          const inboundCalls = calls.filter(call => call.direction === 'inbound').length;
          const outboundCalls = calls.filter(call => call.direction === 'outbound').length;
          const missedCalls = calls.filter(call => call.status === 'missed' || call.status === 'no-answer').length;

          setStats({
            totalCalls,
            totalDuration,
            averageDuration,
            inboundCalls,
            outboundCalls,
            missedCalls
          });
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching call statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}