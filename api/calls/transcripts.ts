import { VercelRequest, VercelResponse } from '../types';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface TranscriptSegment {
  speaker: 'agent' | 'client';
  text: string;
  timestamp: number; // seconds from start
  sentiment?: 'positive' | 'neutral' | 'negative';
  keywords?: string[];
}

interface CallTranscript {
  id?: string;
  call_id: string;
  client_id?: string;
  transcript_text: string;
  transcript_segments: TranscriptSegment[];
  summary: string;
  sentiment_overall: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  action_items: string[];
  created_at?: string;
  updated_at?: string;
}

// Extract keywords from transcript
function extractKeywords(text: string): string[] {
  // Simple keyword extraction - in production, use NLP library
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'i', 'you', 'we', 'they', 'he', 'she', 'it', 'this', 'that', 'these', 'those']);
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));
  
  // Count word frequency
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });
  
  // Return top 10 most frequent words
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

// Extract action items from transcript
function extractActionItems(segments: TranscriptSegment[]): string[] {
  const actionItems: string[] = [];
  const actionPhrases = [
    'i will', "i'll", 'we will', "we'll", 'need to', 'needs to',
    'should', 'must', 'have to', 'going to', 'plan to',
    'follow up', 'send', 'provide', 'schedule', 'create', 'update'
  ];
  
  segments.forEach(segment => {
    if (segment.speaker === 'agent') {
      const lowerText = segment.text.toLowerCase();
      if (actionPhrases.some(phrase => lowerText.includes(phrase))) {
        actionItems.push(segment.text);
      }
    }
  });
  
  return actionItems;
}

// Analyze overall sentiment
function analyzeSentiment(segments: TranscriptSegment[]): 'positive' | 'neutral' | 'negative' {
  const sentimentScores = { positive: 0, neutral: 0, negative: 0 };
  
  segments.forEach(segment => {
    if (segment.sentiment) {
      sentimentScores[segment.sentiment]++;
    }
  });
  
  // Return the most common sentiment
  if (sentimentScores.positive > sentimentScores.negative) {
    return 'positive';
  } else if (sentimentScores.negative > sentimentScores.positive) {
    return 'negative';
  }
  return 'neutral';
}

// Generate summary from transcript
function generateSummary(segments: TranscriptSegment[]): string {
  // In production, use AI/NLP for better summaries
  const totalSegments = segments.length;
  const clientSegments = segments.filter(s => s.speaker === 'client');
  const agentSegments = segments.filter(s => s.speaker === 'agent');
  
  // Find the main topics discussed (simplified)
  const allText = segments.map(s => s.text).join(' ');
  const keywords = extractKeywords(allText).slice(0, 5);
  
  return `Call consisted of ${totalSegments} exchanges between agent (${agentSegments.length}) and client (${clientSegments.length}). Main topics: ${keywords.join(', ')}`;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Get transcript by call ID
      const { call_id, client_id } = req.query;
      
      if (call_id) {
        const { data, error } = await supabase
          .from('call_transcripts')
          .select('*')
          .eq('call_id', call_id)
          .single();
        
        if (error) {
          return res.status(404).json({ error: 'Transcript not found' });
        }
        
        return res.status(200).json(data);
      }
      
      if (client_id) {
        // Get all transcripts for a client
        const { data, error } = await supabase
          .from('call_transcripts')
          .select('*')
          .eq('client_id', client_id)
          .order('created_at', { ascending: false });
        
        if (error) {
          return res.status(500).json({ error: 'Failed to fetch transcripts' });
        }
        
        return res.status(200).json(data);
      }
      
      return res.status(400).json({ error: 'call_id or client_id required' });

    case 'POST':
      // Create or update transcript
      try {
        const transcript: CallTranscript = req.body;
        
        // Validate required fields
        if (!transcript.call_id || !transcript.transcript_segments) {
          return res.status(400).json({ error: 'call_id and transcript_segments required' });
        }
        
        // Get call details to link to client
        const { data: callData } = await supabase
          .from('calls')
          .select('client_id')
          .eq('call_id', transcript.call_id)
          .single();
        
        if (callData) {
          transcript.client_id = callData.client_id;
        }
        
        // Process transcript
        transcript.transcript_text = transcript.transcript_segments
          .map(s => `${s.speaker}: ${s.text}`)
          .join('\n');
        
        transcript.keywords = extractKeywords(transcript.transcript_text);
        transcript.action_items = extractActionItems(transcript.transcript_segments);
        transcript.sentiment_overall = analyzeSentiment(transcript.transcript_segments);
        transcript.summary = transcript.summary || generateSummary(transcript.transcript_segments);
        
        // Check if transcript already exists
        const { data: existing } = await supabase
          .from('call_transcripts')
          .select('id')
          .eq('call_id', transcript.call_id)
          .single();
        
        let result;
        if (existing) {
          // Update existing transcript
          transcript.updated_at = new Date().toISOString();
          const { data, error } = await supabase
            .from('call_transcripts')
            .update(transcript)
            .eq('id', existing.id)
            .select()
            .single();
          
          if (error) throw error;
          result = data;
        } else {
          // Create new transcript
          transcript.created_at = new Date().toISOString();
          const { data, error } = await supabase
            .from('call_transcripts')
            .insert(transcript)
            .select()
            .single();
          
          if (error) throw error;
          result = data;
        }
        
        // Update call record with transcript availability
        await supabase
          .from('calls')
          .update({ has_transcript: true })
          .eq('call_id', transcript.call_id);
        
        return res.status(201).json(result);
      } catch (error) {
        console.error('Error saving transcript:', error);
        return res.status(500).json({ error: 'Failed to save transcript' });
      }

    case 'DELETE':
      // Delete transcript
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Transcript ID required' });
      }
      
      const { error } = await supabase
        .from('call_transcripts')
        .delete()
        .eq('id', id);
      
      if (error) {
        return res.status(500).json({ error: 'Failed to delete transcript' });
      }
      
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}