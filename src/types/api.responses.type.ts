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
  email: string;
  phone_number: string;
  logo: string | null;
  brand_color: string;
  vat_number: string | null;
  currency: string;
  is_company_name_show: boolean;
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

export interface ApiResponse<T> {
  result: boolean;
  requestId: string;
  message: string;
  messageLBL: string;
  payload: T;
}
