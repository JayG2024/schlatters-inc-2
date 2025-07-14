// Vercel serverless function types for non-Next.js projects
export interface VercelRequest {
  method?: string;
  query: Record<string, string | string[]>;
  cookies: Record<string, string>;
  body?: any;
  headers: Record<string, string | string[] | undefined>;
}

export interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  send: (data: any) => void;
  end: () => void;
  setHeader: (name: string, value: string | string[]) => VercelResponse;
}