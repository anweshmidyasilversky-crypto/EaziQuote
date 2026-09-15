import type { AppConfig } from "@/types/api.responses.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const configInitial: AppConfig = {
  measurement_units: [],
  quote_categories: [],
  quote_invoice_settings: {
    terms_and_conditions:
      "Payment is due within 15 days. Late payments may incur additional fees.",
    footer_message: "Thank you for your business!",
    signature: null,
  },
  billing_preferences: {
    vat: {
      id: 14,
      name: "Zero rated",
      description: "Zero rated",
      value: "0",
    },
    quote_expiration: 30,
    payment_expiration: 0,
  },
  notification_settings: {
    email_notification_enabled: false,
    push_notification_enabled: false,
  },
  vat_settings: [],
  vertical_markets: [],
  support_ticket_areas: [],
  document_setting: {
    categories: {
      by_item: "by-item",
      by_category: "by-category",
      by_subcategory: "by-subcategory",
      by_category_subcategory_item: "by-category-subcategory-item",
    },
    templates: {
      classic: "classic",
      modern: "modern",
      elegant: "elegant",
    },
  },
};

export const appConfigSlice = createSlice({
  name: "appConfig",
  initialState: configInitial,
  reducers: {
    updateConfig: (state, action: PayloadAction<Partial<AppConfig>>) => {
      Object.assign(state, action.payload);
    },

    clearConfig: (state) => {
      Object.assign(state, configInitial);
    },
  },
});

export const { updateConfig, clearConfig } = appConfigSlice.actions;

export default appConfigSlice.reducer;
