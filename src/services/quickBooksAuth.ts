import { supabase } from '../lib/supabase';

interface QuickBooksTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  x_refresh_token_expires_in: number;
}

interface QuickBooksCompanyInfo {
  CompanyName: string;
  CompanyAddr?: {
    Line1?: string;
    City?: string;
    CountrySubDivisionCode?: string;
    PostalCode?: string;
  };
  PrimaryPhone?: {
    FreeFormNumber?: string;
  };
  CompanyEmail?: {
    Address?: string;
  };
}

export class QuickBooksAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private environment: 'sandbox' | 'production';
  
  constructor(
    clientId: string, 
    clientSecret: string, 
    redirectUri: string,
    environment: 'sandbox' | 'production' = 'sandbox'
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.environment = environment;
  }

  // Get OAuth authorization URL
  getAuthorizationUrl(state?: string): string {
    const baseUrl = 'https://appcenter.intuit.com/connect/oauth2';
    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: 'com.intuit.quickbooks.accounting',
      redirect_uri: this.redirectUri,
      response_type: 'code',
      ...(state && { state })
    });
    
    return `${baseUrl}?${params.toString()}`;
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string, realmId: string): Promise<QuickBooksTokens> {
    const tokenUrl = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
    const basicAuth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code for tokens: ${error}`);
    }

    const tokens = await response.json() as QuickBooksTokens;
    
    // Store tokens in database
    await this.storeTokens(tokens, realmId);
    
    return tokens;
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string, realmId: string): Promise<QuickBooksTokens> {
    const tokenUrl = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
    const basicAuth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to refresh token: ${error}`);
    }

    const tokens = await response.json() as QuickBooksTokens;
    await this.storeTokens(tokens, realmId);
    return tokens;
  }

  // Store tokens in database
  private async storeTokens(tokens: QuickBooksTokens, realmId: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in);
    
    const refreshExpiresAt = new Date();
    refreshExpiresAt.setSeconds(refreshExpiresAt.getSeconds() + tokens.x_refresh_token_expires_in);

    const { error } = await supabase
      .from('quickbooks_tokens')
      .upsert({
        realm_id: realmId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: expiresAt.toISOString(),
        refresh_expires_at: refreshExpiresAt.toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'realm_id'
      });

    if (error) {
      throw new Error(`Failed to store tokens: ${error.message}`);
    }
  }

  // Get stored tokens from database
  async getStoredTokens(realmId: string): Promise<QuickBooksTokens | null> {
    const { data, error } = await supabase
      .from('quickbooks_tokens')
      .select('*')
      .eq('realm_id', realmId)
      .single();

    if (error || !data) {
      return null;
    }

    // Check if token needs refresh
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    
    if (now >= expiresAt) {
      // Token expired, try to refresh
      try {
        const newTokens = await this.refreshAccessToken(data.refresh_token);
        await this.storeTokens(newTokens, realmId);
        return newTokens;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
      }
    }

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: Math.floor((expiresAt.getTime() - now.getTime()) / 1000),
      token_type: 'bearer',
      x_refresh_token_expires_in: Math.floor((new Date(data.refresh_expires_at).getTime() - now.getTime()) / 1000)
    };
  }

  // Make authenticated API request
  async makeApiRequest(
    endpoint: string, 
    accessToken: string, 
    realmId: string,
    options: RequestInit = {}
  ): Promise<any> {
    const baseUrl = this.environment === 'sandbox' 
      ? 'https://sandbox-quickbooks.api.intuit.com' 
      : 'https://quickbooks.api.intuit.com';
    
    const url = `${baseUrl}/v3/company/${realmId}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`QuickBooks API error: ${response.status} - ${error}`);
    }

    return await response.json();
  }

  // Get company info
  async getCompanyInfo(accessToken: string, realmId: string): Promise<QuickBooksCompanyInfo> {
    const result = await this.makeApiRequest('/companyinfo/1', accessToken, realmId);
    return result.CompanyInfo;
  }

  // Revoke tokens
  async revokeTokens(token: string): Promise<void> {
    const revokeUrl = 'https://developer.api.intuit.com/v2/oauth2/tokens/revoke';
    const basicAuth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    const response = await fetch(revokeUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`
      },
      body: new URLSearchParams({
        token
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to revoke token: ${error}`);
    }
  }
}

// Validate required environment variables
const requiredEnvVars = {
  QUICKBOOKS_CLIENT_ID: process.env.QUICKBOOKS_CLIENT_ID,
  QUICKBOOKS_CLIENT_SECRET: process.env.QUICKBOOKS_CLIENT_SECRET,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

const environment = process.env.QUICKBOOKS_ENVIRONMENT;
if (environment && !['sandbox', 'production'].includes(environment)) {
  throw new Error(
    `Invalid QUICKBOOKS_ENVIRONMENT: ${environment}. Must be 'sandbox' or 'production'`
  );
}

// Export singleton instance
export const quickBooksAuth = new QuickBooksAuth(
  requiredEnvVars.QUICKBOOKS_CLIENT_ID!,
  requiredEnvVars.QUICKBOOKS_CLIENT_SECRET!,
  process.env.QUICKBOOKS_REDIRECT_URI ||
    `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/auth/quickbooks/callback`,
  (environment as 'sandbox' | 'production') || 'sandbox'
);