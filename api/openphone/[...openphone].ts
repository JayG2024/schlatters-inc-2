import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { openphone } = req.query;
  const apiKey = process.env.OPENPHONE_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenPhone API key not configured' });
  }
  
  if (!Array.isArray(openphone)) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  
  const [resource, action] = openphone;
  
  try {
    switch (resource) {
      case 'calls':
        return handleCalls(req, res, action, apiKey);
      case 'messages':
        return handleMessages(req, res, action, apiKey);
      case 'contacts':
        return handleContacts(req, res, action, apiKey);
      case 'webhooks':
        return handleWebhooks(req, res, apiKey);
      default:
        return res.status(404).json({ error: 'Resource not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleCalls(req: VercelRequest, res: VercelResponse, action: string | undefined, apiKey: string) {
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  
  if (req.method === 'GET') {
    // Fetch call logs
    const response = await fetch('https://api.openphone.com/v1/calls', { headers });
    const data = await response.json();
    return res.status(200).json(data);
  }
  
  if (req.method === 'POST' && action === 'initiate') {
    // Initiate a call
    const response = await fetch('https://api.openphone.com/v1/calls', {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    return res.status(201).json(data);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleMessages(req: VercelRequest, res: VercelResponse, action: string | undefined, apiKey: string) {
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  
  if (req.method === 'GET') {
    // Fetch messages
    const response = await fetch('https://api.openphone.com/v1/messages', { headers });
    const data = await response.json();
    return res.status(200).json(data);
  }
  
  if (req.method === 'POST' && action === 'send') {
    // Send a message
    const response = await fetch('https://api.openphone.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    return res.status(201).json(data);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleContacts(req: VercelRequest, res: VercelResponse, action: string | undefined, apiKey: string) {
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  
  if (req.method === 'GET') {
    // Fetch contacts
    const response = await fetch('https://api.openphone.com/v1/contacts', { headers });
    const data = await response.json();
    return res.status(200).json(data);
  }
  
  if (req.method === 'POST' && action === 'sync') {
    // Sync contacts
    // TODO: Implement contact sync logic
    return res.status(200).json({ message: 'Contacts sync initiated' });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleWebhooks(req: VercelRequest, res: VercelResponse, apiKey: string) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Handle OpenPhone webhook events
  const { event, data } = req.body;
  
  // TODO: Process webhook based on event type
  switch (event) {
    case 'call.completed':
      // Handle completed call
      break;
    case 'message.received':
      // Handle received message
      break;
    default:
      // Unhandled webhook event
  }
  
  return res.status(200).json({ received: true });
}