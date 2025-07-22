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
  const baseUrl = VERCEL_URL ? `https://${VERCEL_URL}` : 'http://localhost:3000';
  
  if (action === 'callback') {
    // Handle OAuth callback
    const { code, realmId, state, error: authError } = req.query;
    
    if (authError) {
      console.error('QuickBooks auth error:', authError);
      return res.redirect(`${baseUrl}/admin/settings?tab=integrations&error=quickbooks_auth_failed`);
    }
    
    if (!code || !realmId) {
      return res.redirect(`${baseUrl}/admin/settings?tab=integrations&error=missing_auth_params`);
    }
    
    try {
      // Exchange code for tokens
      const tokenUrl = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
      const basicAuth = Buffer.from(`${QUICKBOOKS_CLIENT_ID}:${QUICKBOOKS_CLIENT_SECRET}`).toString('base64');
      const redirectUri = `${baseUrl}/api/auth/quickbooks/callback`;
      
      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuth}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: redirectUri
        })
      });
      
      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('Token exchange failed:', error);
        return res.redirect(`${baseUrl}/admin/settings?tab=integrations&error=token_exchange_failed`);
      }
      
      const tokens = await tokenResponse.json();
      
      // Store tokens in environment variables temporarily
      // In production, these should be stored securely in a database
      process.env.QUICKBOOKS_ACCESS_TOKEN = tokens.access_token;
      process.env.QUICKBOOKS_REFRESH_TOKEN = tokens.refresh_token;
      process.env.QUICKBOOKS_REALM_ID = realmId as string;
      
      // Redirect back to settings with success
      return res.redirect(`${baseUrl}/admin/settings?tab=integrations&success=quickbooks_connected`);
      
    } catch (error) {
      console.error('QuickBooks auth error:', error);
      return res.redirect(`${baseUrl}/admin/settings?tab=integrations&error=quickbooks_auth_error`);
    }
  }
  
  // Initiate OAuth flow
  const redirectUri = `${baseUrl}/api/auth/quickbooks/callback`;
  const state = Math.random().toString(36).substring(7); // Generate random state
  const authUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${QUICKBOOKS_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=com.intuit.quickbooks.accounting&state=${state}`;
  
  return res.redirect(authUrl);
}