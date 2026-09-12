import type { Method } from "axios";
import type {
  QuoteCategories,
  QuoteDetails,
  QuoteItem,
  QuoteTemplate,
} from "./api.responses.type";

export enum deviceType {
  android = "android",
  ios = "ios",
  web = "web",
}

export interface SignupPayload {
  email: string;
  password: string;
  device_type: deviceType;
}

export interface BusinessProfileApiPayload {
  name: string;
  email: string | null;
  phone_number: string;
  logo: File | null;
  brand_color: string;
  vat_number: string | null;
  currency: string | null;
  is_company_name_show: boolean | null;
}

export interface BusinessAddressApiPayload {
  address: string;
  city?: string;
  state?: string | null;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  postcode: string;
}

export interface PageFilters {
  page?: Number;
  status?: string[];
  start_date?: string | Date;
  end_date?: string | Date;
  search?: string;
  sort_by?: string | null;
}

export interface ClientCreateApiPayload {
  email?: string;
  phone: string;
  name: string;
  company_name: string;
  address: string;
  brand_color?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface UpdateClientApiPayload extends Partial<ClientCreateApiPayload> {
  _method: Method;
}

export interface CreateQuoteApiPayload {
  title: string;
  description: string;
  quote_date: Date;
  expiry_date: Date;
  client_id: number;
  attachments?: File[];
  notes: string;
}

export interface UpdateQuoteApiPayload extends Partial<CreateQuoteApiPayload> {
  _method: Method;
  items?: QuoteItem[];
  template?: QuoteTemplate;
  categorised?: QuoteCategories;
}
