export interface ApiResponse<T> {
  result: boolean;
  requestId: string;
  message: string;
  messageLBL: string;
  payload: T;
}
export interface CompanyAddress {
  id: number;
  address: string;
  city: string;
  state: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  postcode: string;
}

export interface CompanyBillingDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  bank_name: string;
  sort_code: string;
  account_number: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Company {
  id: number;
  name: string;
  email: string | null;
  phone_number: string;
  logo: string | null;
  brand_color: string;
  vat_number: string | null;
  currency: string | null;
  is_company_name_show: boolean | null;
  address: CompanyAddress;
  billing_details: CompanyBillingDetails;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  is_email_verified: boolean;
  is_active: boolean;
  avatar: string | null;
  access_token: string;
  company: Company;
  is_profile_setup: boolean;
  is_company_profile_setup: boolean;
  is_company_address_setup: boolean;
  created_at: string;
  updated_at: string;
  is_subscription_active: boolean;
  subscription_ended_at: string | null;
  is_trial_period: boolean;
  subscription_amount: number | null;
  hasBankAccountDetailAdded: boolean;
  hasSignatureAdded: boolean;
  is_team_member: boolean;
  default_payment_method: string;
  stripe_connected: boolean;
  stripe_account_status: string;
}

export interface AddressDetails {
  postcode: string;
  latitude: number;
  longitude: number;
  formatted_address: string;
  address_line_1: string;
  address_line_2: string | null;
  address_line_3: string | null;
  address_line_4: string | null;
  city: string;
  county: string;
  district: string;
  country: string;
  manually: boolean;
}

export enum ActivityType {
  INVOICE = "invoice",
  QUOTE = "quote",
}

// Shared fields across both invoices and quotes
interface BaseActivity {
  id: number;
  title: string;
  name: string;
  reference_number: string;
  is_editable: boolean;
  price: number;
  expiry_date: string;
  created_at: string;
}

export interface InvoiceActivity extends BaseActivity {
  type: ActivityType.INVOICE;
  quote_reference_number: string | null;
  status: "paid" | "unpaid" | "overdue" | string;
  total_due: number;
  deposit_required: boolean;
  deposit_type: string | null;
  deposit_amount: number | null;
  deposit_available: number;
}

export interface QuoteActivity extends BaseActivity {
  type: ActivityType.QUOTE;
  vat_setting_id: string;
  vat: number;
  discount: number | null;
  status: "approved" | "sent" | "draft" | string;
  categorised: "by-item" | string;
  template: "classic" | string;
}

// Discriminated union for the array
export type DashboardActivityItem = InvoiceActivity | QuoteActivity;

// Root structure definitions
export interface InvoiceSummary {
  outstanding_invoices_amount: number;
  overdue_invoices: number;
}

export interface QuoteSummary {
  pending_quotes_amount: number;
  active_quotes: number;
}

export interface FinancialSummary {
  money_due_this_week: number;
  quotes_accepted_not_invoiced: number;
}

// Main Dashboard interface containing the payload
export interface DashboardResponse {
  invoiceDetails: InvoiceSummary;
  quoteDetails: QuoteSummary;
  financialSummary: FinancialSummary;
  recentActivities: DashboardActivityItem[];
}

export interface QuoteStatus {
  id: number;
  status: string;
  display_name: string;
  color: string | null;
}

export interface QuoteClient {
  id: number;
  name: string;
  company_name: string;
  phone: string;
  email: string;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: number;
  name: string;
  description: string | null;
  quantity: number | null;
  price_per_unit: number;
  category_id: number;
  category_name: string;
}

export interface QuoteAttachment {
  id: number;
  url: string;
  type: string;
}

export interface Quote {
  id: number;
  title: string;
  job_description: string;
  reference_number: string;
  quote_date: string;
  expiry_date: string;
  url: string | null;
  status: QuoteStatus;
  client: QuoteClient;
  items: Record<string, QuoteItem[]> | QuoteItem[];
  attachments: QuoteAttachment[];
  is_editable: boolean;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationBtnMeta {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ApiResponseMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationBtnMeta[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface QuoteListResponse {
  summary: {
    total_count: number;
    accepted_count: number;
    expired_count: number;
    pending_count: number;
  };
  data: Quote[];
  links: PaginationLinks;
  meta: ApiResponseMeta;
}

export interface Notification {
  id: null | string;
  title: string;
  message: string;
  type: string;
  landing_screen: string;
  created_at: string;
}

export interface NotificationListResponse {
  data: Notification[];
  links: PaginationLinks;
  meta: ApiResponseMeta;
}

export interface Client {
  id: number;
  name: string;
  company_name: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
  updated_at: string;
}
