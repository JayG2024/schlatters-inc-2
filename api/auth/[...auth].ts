import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { auth } = req.query;
  
  // Handle different auth endpoints
  if (Array.isArray(auth)) {
    const [provider, action] = auth;
    
    switch (provider) {
      case 'google':
        return handleGoogleAuth(req, res, action);
      case 'quickbooks':
        return handleQuickBooksAuth(req, res, action);
      default:
        return res.status(404).json({ error: 'Auth provider not found' });
    }
  }
  
  return res.status(400).json({ error: 'Invalid auth request' });
}

async function handleGoogleAuth(req: VercelRequest, res: VercelResponse, action?: string) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, VERCEL_URL } = process.env;
  
  if (action === 'callback') {
    // Handle OAuth callback
    const { code } = req.query;
    // TODO: Exchange code for tokens
    return res.status(200).json({ message: 'Google auth callback received' });
  }
  
  // Initiate OAuth flow
  const redirectUri = `https://${VERCEL_URL}/api/auth/google/callback`;
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar`;
  
  return res.redirect(authUrl);
}

async function handleQuickBooksAuth(req: VercelRequest, res: VercelResponse, action?: string) {
  const { QUICKBOOKS_CLIENT_ID, QUICKBOOKS_CLIENT_SECRET, VERCEL_URL } = process.env;
  
  if (action === 'callback') {
    // Handle OAuth callback
    const { code } = req.query;
    // TODO: Exchange code for tokens
    return res.status(200).json({ message: 'QuickBooks auth callback received' });
  }
  
  // Initiate OAuth flow
  const redirectUri = `https://${VERCEL_URL}/api/auth/quickbooks/callback`;
  const authUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${QUICKBOOKS_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=com.intuit.quickbooks.accounting`;
  
  return res.redirect(authUrl);
}