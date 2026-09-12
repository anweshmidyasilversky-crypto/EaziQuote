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

export enum InvoiceStatus {
  paid = "paid",
  unpaid = "unpaid",
  overdue = "overdue",
}

export interface InvoiceActivity extends BaseActivity {
  type: ActivityType.INVOICE;
  quote_reference_number: string | null;
  status: InvoiceStatus;
  total_due: number;
  deposit_required: boolean;
  deposit_type: string | null;
  deposit_amount: number | null;
  deposit_available: number;
}

export enum QuoteTemplate {
  classic = "classic",
  modern = "modern",
  elegant = "elegant",
}

export enum QuoteStatus {
  approved = "approved",
  sent = "sent",
  draft = "draft",
  accepted = "accepted",
}

export interface QuoteActivity extends BaseActivity {
  type: ActivityType.QUOTE;
  vat_setting_id: string;
  vat: number;
  discount: number | null;
  status: QuoteStatus;
  categorised: "by-item" | string;
  template: QuoteTemplate;
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

export interface Client {
  id: number;
  name: string;
  company_name: string;
  phone: string;
  email: string;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: number;
  name: string;
  description: string | null;
  quantity: number | null;
  price_per_unit: number;
  category_id: number;
  category_name: string;
}

export interface Attachment {
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
  status: {
    id: number;
    status: QuoteStatus;
    display_name: string;
    color: string | null;
  };
  client: Client;
  items: Item[];
  attachments: Attachment[];
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

export interface ListResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: ApiResponseMeta;
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

export interface ClientDetails extends Client {
  city: string;
  postcode: string;
  country: string;
  total_invoices: number;
  total_quotes: number;
  quote_accepted_count: number;
  total_invoices_amount: number;
  total_quotes_amount: number;
  available_credit: number;
  recent_activities: (QuoteActivity | InvoiceActivity)[];
}

export enum PaymentMethods {
  stripe = "stripe",
  cash = "cash",
}
export enum PaymentAmountType {
  invoice = "invoice",
  deposit = "deposit",
}
export enum PaymentStatus {
  Received = "received",
  Failed = "failed",
  Pending = "pending",
}

export interface Payment {
  id: number;
  payment_method: PaymentMethods;
  amount_type: PaymentAmountType;
  status: PaymentStatus;
  amount: number;
  amount_formatted: string;
  allocated: string;
  credit: string;
  currency: string;
  payment_date: string;
  stripe_payment_link_url: null | string;
  client_name: string;
  client_email: string;
  payment_link_url: string;
}

export interface QuoteItem extends Item {
  id: number;
  type: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  total_price: number;
  cost: number;
  total_cost: number;
  is_added: boolean;
  category_id: number;
  category_name: string;
  subcategory_id: null | number;
  subcategory_name: null | string;
}

export interface PresetQuoteListing {
  id: number;
  name: string;
  description: string;
  quote_description: null | string;
  active: number;
  created_at: string;
  updated_at: string;
  items_count: number;
}

export interface PresetQuote extends PresetQuoteListing {
  items: Item[];
}

export enum QuoteCategories {
  byItem = "by-item",
  byCat = "by-category",
  bySubCat = "by-subcategory",
  all = "by-category-subcategory-item",
}

export interface QuoteDetails extends Omit<Quote, "status"> {
  notes: string;
  url: string;
  status: QuoteStatus;
  deposit_required: boolean;
  deposit_type: null | string;
  deposit_amount: null | number;
  deposit_percentage: null | number;
  categorised: QuoteCategories;
  template: QuoteTemplate;
  client: ClientDetails;
  items: QuoteItem[];
  is_editable: boolean;
  vat_setting_id: number;
  vat: number;
  is_company_phone_number_show: boolean;
  discount: null | number;
  financial_summary: {
    total_cost: number;
    sub_total: number;
    tax: number;
    discount: number;
    grand_total: number;
  };
  created_at: string;
  updated_at: string;
  route_url: string;
  deposit_payment: null | string;
}
