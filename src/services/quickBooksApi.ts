import { quickBooksAuth, QuickBooksAuth } from './quickBooksAuth';

interface QuickBooksCustomer {
  Id: string;
  DisplayName: string;
  CompanyName?: string;
  GivenName?: string;
  FamilyName?: string;
  PrimaryPhone?: {
    FreeFormNumber: string;
  };
  PrimaryEmailAddr?: {
    Address: string;
  };
  Balance?: number;
  Active?: boolean;
  SyncToken?: string;
  sparse?: boolean;
}

interface QuickBooksInvoice {
  Id: string;
  DocNumber: string;
  TxnDate: string;
  DueDate: string;
  TotalAmt: number;
  Balance: number;
  CustomerRef: {
    value: string;
    name?: string;
  };
  Line: Array<{
    Amount: number;
    Description?: string;
    DetailType: string;
    SalesItemLineDetail?: {
      ItemRef: {
        value: string;
        name?: string;
      };
    };
  }>;
  sparse?: boolean;
  SyncToken?: string;
}

interface QuickBooksPayment {
  Id: string;
  TxnDate: string;
  TotalAmt: number;
  CustomerRef: {
    value: string;
    name?: string;
  };
  DepositToAccountRef?: {
    value: string;
  };
  Line?: Array<{
    Amount: number;
    LinkedTxn?: Array<{
      TxnId: string;
      TxnType: string;
    }>;
  }>;
}

export class QuickBooksAPI {
  private auth: QuickBooksAuth;
  
  constructor(auth: QuickBooksAuth) {
    this.auth = auth;
  }

  // Get access token for a realm
  private async getAccessToken(realmId: string): Promise<string> {
    const tokens = await this.auth.getStoredTokens(realmId);
    if (!tokens) {
      throw new Error('No valid tokens found. Please authenticate first.');
    }
    return tokens.access_token;
  }

  // Query helper
  private async query<T>(
    realmId: string, 
    query: string
  ): Promise<T[]> {
    const accessToken = await this.getAccessToken(realmId);
    const encodedQuery = encodeURIComponent(query);
    const result = await this.auth.makeApiRequest(
      `/query?query=${encodedQuery}`,
      accessToken,
      realmId
    );
    return result.QueryResponse[Object.keys(result.QueryResponse)[0]] || [];
  }

  // CUSTOMERS
  async getCustomers(realmId: string, maxResults: number = 100): Promise<QuickBooksCustomer[]> {
    return this.query<QuickBooksCustomer>(
      realmId,
      `SELECT * FROM Customer WHERE Active = true MAXRESULTS ${maxResults}`
    );
  }

  async getCustomer(realmId: string, customerId: string): Promise<QuickBooksCustomer> {
    const accessToken = await this.getAccessToken(realmId);
    const result = await this.auth.makeApiRequest(
      `/customer/${customerId}`,
      accessToken,
      realmId
    );
    return result.Customer;
  }

  async createCustomer(
    realmId: string, 
    customer: Partial<QuickBooksCustomer>
  ): Promise<QuickBooksCustomer> {
    const accessToken = await this.getAccessToken(realmId);
    const result = await this.auth.makeApiRequest(
      '/customer',
      accessToken,
      realmId,
      {
        method: 'POST',
        body: JSON.stringify(customer)
      }
    );
    return result.Customer;
  }

  async updateCustomer(
    realmId: string,
    customerId: string,
    updates: Partial<QuickBooksCustomer>
  ): Promise<QuickBooksCustomer> {
    // First get the current customer to get SyncToken
    const currentCustomer = await this.getCustomer(realmId, customerId);
    
    const accessToken = await this.getAccessToken(realmId);
    const result = await this.auth.makeApiRequest(
      '/customer',
      accessToken,
      realmId,
      {
        method: 'POST',
        body: JSON.stringify({
          ...updates,
          Id: customerId,
          SyncToken: currentCustomer.SyncToken,
          sparse: true
        })
      }
    );
    return result.Customer;
  }

  // INVOICES
  async getInvoices(
    realmId: string, 
    customerId?: string,
    maxResults: number = 100
  ): Promise<QuickBooksInvoice[]> {
    let query = 'SELECT * FROM Invoice';
    if (customerId) {
      query += ` WHERE CustomerRef = '${customerId}'`;
    }
    query += ` MAXRESULTS ${maxResults}`;
    
    return this.query<QuickBooksInvoice>(realmId, query);
  }

  async getInvoice(realmId: string, invoiceId: string): Promise<QuickBooksInvoice> {
    const accessToken = await this.getAccessToken(realmId);
    const result = await this.auth.makeApiRequest(
      `/invoice/${invoiceId}`,
      accessToken,
      realmId
    );
    return result.Invoice;
  }

  async createInvoice(
    realmId: string,
    invoice: Partial<QuickBooksInvoice>
  ): Promise<QuickBooksInvoice> {
    const accessToken = await this.getAccessToken(realmId);
    const result = await this.auth.makeApiRequest(
      '/invoice',
      accessToken,
      realmId,
      {
        method: 'POST',
        body: JSON.stringify(invoice)
      }
    );
    return result.Invoice;
  }

  async getOverdueInvoices(realmId: string): Promise<QuickBooksInvoice[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.query<QuickBooksInvoice>(
      realmId,
      `SELECT * FROM Invoice WHERE Balance > 0 AND DueDate < '${today}'`
    );
  }

  // PAYMENTS
  async getPayments(
    realmId: string,
    customerId?: string,
    maxResults: number = 100
  ): Promise<QuickBooksPayment[]> {
    let query = 'SELECT * FROM Payment';
    if (customerId) {
      query += ` WHERE CustomerRef = '${customerId}'`;
    }
    query += ` MAXRESULTS ${maxResults}`;
    
    return this.query<QuickBooksPayment>(realmId, query);
  }

  async createPayment(
    realmId: string,
    payment: Partial<QuickBooksPayment>
  ): Promise<QuickBooksPayment> {
    const accessToken = await this.getAccessToken(realmId);
    const result = await this.auth.makeApiRequest(
      '/payment',
      accessToken,
      realmId,
      {
        method: 'POST',
        body: JSON.stringify(payment)
      }
    );
    return result.Payment;
  }

  // ITEMS (for invoice line items)
  async getItems(realmId: string): Promise<any[]> {
    return this.query(
      realmId,
      'SELECT * FROM Item WHERE Active = true'
    );
  }

  async createItem(realmId: string, item: any): Promise<any> {
    const accessToken = await this.getAccessToken(realmId);
    const result = await this.auth.makeApiRequest(
      '/item',
      accessToken,
      realmId,
      {
        method: 'POST',
        body: JSON.stringify(item)
      }
    );
    return result.Item;
  }

  // ACCOUNTS (for chart of accounts)
  async getAccounts(realmId: string): Promise<any[]> {
    return this.query(
      realmId,
      'SELECT * FROM Account WHERE Active = true'
    );
  }

  // COMPANY INFO
  async getCompanyInfo(realmId: string): Promise<any> {
    const accessToken = await this.getAccessToken(realmId);
    return this.auth.getCompanyInfo(accessToken, realmId);
  }

  // REPORTS
  async getProfitAndLoss(
    realmId: string,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    const accessToken = await this.getAccessToken(realmId);
    let endpoint = '/reports/ProfitAndLoss';
    const params = new URLSearchParams();
    
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return this.auth.makeApiRequest(endpoint, accessToken, realmId);
  }

  async getBalanceSheet(
    realmId: string,
    asOfDate?: string
  ): Promise<any> {
    const accessToken = await this.getAccessToken(realmId);
    let endpoint = '/reports/BalanceSheet';
    
    if (asOfDate) {
      endpoint += `?as_of_date=${asOfDate}`;
    }
    
    return this.auth.makeApiRequest(endpoint, accessToken, realmId);
  }
}

// Export singleton instance
export const quickBooksApi = new QuickBooksAPI(quickBooksAuth);