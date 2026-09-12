import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  QuoteCategories,
  QuoteStatus,
  QuoteTemplate,
  type ClientDetails,
  type Quote,
  type QuoteDetails,
} from "@/types/api.responses.type";

const initialState: QuoteDetails = {
  id: 0,
  title: "",
  deposit_required: false,
  deposit_type: null,
  deposit_amount: null,
  deposit_percentage: null,
  categorised: QuoteCategories.byItem,
  template: QuoteTemplate.classic,
  notes: "",
  job_description: "",
  reference_number: "",
  quote_date: "",
  expiry_date: "",
  url: "",
  status: QuoteStatus.draft,
  client: {} as ClientDetails,
  items: [],
  is_editable: true,
  vat_setting_id: 14,
  vat: 0,
  is_company_phone_number_show: true,
  discount: null,
  financial_summary: {
    total_cost: 0,
    sub_total: 0,
    tax: 0,
    discount: 0,
    grand_total: 0,
  },
  attachments: [],
  created_at: "",
  updated_at: "",
  route_url: "",
  deposit_payment: null,
};

export const quotesSlice = createSlice({
  initialState,
  name: "quote",
  reducers: {
    updateQuote(state, action: PayloadAction<Partial<Quote>>) {
      Object.assign(state, action.payload);
    },
    removeQuote(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { updateQuote, removeQuote } = quotesSlice.actions;

export default quotesSlice.reducer;
