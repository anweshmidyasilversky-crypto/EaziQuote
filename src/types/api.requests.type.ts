import type { Method } from "axios";
import type {
  PaymentAmountType,
  PaymentMethods,
  QuoteDetails,
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
  quote_id?: string | number;
  invoice_id?: string | number;
  category_id?: string | number;
  client_id?: string | number;
  subcategory_ids?: (string | number)[];
  is_not_paid?: number;
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
  quote_date: Date | string;
  expiry_date: Date | string;
  client_id: number;
  attachments?: File[];
  notes: string;
}

export interface UpdateQuoteItems {
  id: number;
  quantity: number;
  type: string;
  price: number;
  name: string;
  cost: number;
}

export interface UpdateQuoteApiPayload extends Partial<
  Omit<QuoteDetails, "attachments" | "items" | "discount">
> {
  _method: Method;
  quote_id: string | number;
  attachments?: File[];
  description?: string;
  client_id?: number;
  items?: UpdateQuoteItems[];
  deposit_payment_method?: PaymentMethods;
  discount?: number | undefined | null;
}

export interface ItemCreateApiPayload {
  name: string;
  type: string;
  unit: string;
  price: number;
  cost: number;
  category_id: number;
  subcategory_id?: number;
  quote_id?: number;
  invoice_id?: number;
}

export interface SubCategoryCreateApiPayload {
  category_id: number | string;
  name: string;
}

export interface subCategoryUpdateApiPayload extends Partial<SubCategoryCreateApiPayload> {
  id: number | string;
}

export enum DepositeTypes {
  fixed = "fixed",
  percentage = "percentage",
}

export interface ProposalDocumentCreatePayload {
  title: string;
  sort?: number;
  content?: string;
}

export interface ProposalDocumentUpdatePayload extends ProposalDocumentCreatePayload {
  title: string;
}

export interface QuoteSectionCreatePayload {
  title: string;
  content?: string;
  sort?: number | string;
}

export interface QuoteSectionUpdatePayload extends QuoteSectionCreatePayload {
  id: string | number;
}

export interface CreateOrUpdateSectionForQuote {
  quote_id: string | number;
  sections: (QuoteSectionCreatePayload | QuoteSectionUpdatePayload)[];
}

export interface CreatePaymentBase {
  amount_type: PaymentAmountType;
  payment_method: PaymentMethods;
  amount: number;
  payment_date: string;
}

export interface CreatePaymentDeposit extends CreatePaymentBase {
  client_id: string | number;
  order_id: string | number;
}

export interface CreatePaymentInvoice extends CreatePaymentBase {
  invoice_id: string | number;
}
