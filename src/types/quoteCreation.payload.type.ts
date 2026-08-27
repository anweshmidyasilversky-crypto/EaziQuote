export interface QuoteSummary {
  quoteTitle: string;
  referenceNumber: string;
  quoteDate: string;
  expiryDate: string;
  hidePhoneNumber: boolean;
  clientId: string;
  jobDescription: string;
  notes?: string;
  attachments?: File[];
}

export interface QuoteMargins {
  subtotal: number;
  marginPercentage: number;
  taxPercentage: number;
  discount?: QuoteDiscount;
  deposit?: QuoteDeposit;
}

export interface QuoteItem {
  id?: string;
  itemName: string;
  category: string;
  subcategory: string;
  unit: string;
  pricePerUnit: number;
  quantity: number;
  total: number;
}

export interface QuoteDiscount {
  type: "percentage" | "fixed";
  value: number;
  amount: number;
}

export interface QuoteDeposit {
  type: "percentage" | "fixed";
  value: number;
  amount: number;
}

export interface QuoteSection {
  id?: string;
  order: number;
  section: string;
  description: string;
  selected: boolean;
}

export interface QuoteCreationPayload extends QuoteSummary, QuoteMargins {
  items: QuoteItem[];
  sections: QuoteSection[];
}
