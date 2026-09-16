export const API_ENDPOINTS = {
  auth: {
    signup: `/auth/signup`,
    login: `/auth/login`,
    sendVerificationEmail: `/auth/send-verification-email`,
    home: `/home`,
    quoteList: `/quotes`,
    presetQuotes: `/quote-templates`,
    appConfig: `/auth/config`,
  },
  address: {
    addressSearch: `/address/search`,
  },
  categories: {
    getCategoryList: `/categories`,
    createCategory: `/categories`,
    updateCategory: `/categories`,
    deleteCategory: (cat_id: string | number) => `/categories/${cat_id}`,
  },
  clients: {
    createClient: `/clients`,
    updateClient: (client_id: string | number) => `/clients/${client_id}`,
    getClientList: `/clients`,
    getClientDetails: (client_id: string | number) => `/clients/${client_id}`,
    deleteClient: (client_id: string | number) => `/clients/${client_id}`,
  },
  items: {
    getItemList: `/items`,
    itemCreateOrUpdate: `/item/create-or-update`,
    deleteItem: (item_id: string | number) => `/items/${item_id}`,
  },
  notifications: {
    getNotificationList: `/notifications`,
  },
  payments: {
    getPaymentList: `/payments`,
  },
  quotes: {
    getQutoeDetails: (quote_id: string | number) => `/quotes/${quote_id}`,
    getQuoteList: `/quotes`,
    updateQuote: (quote_id: string | number) => `/quotes/${quote_id}`,
    deleteAttachment: (
      quote_id: string | number,
      attachment_id: string | number,
    ) => `/quotes/${quote_id}/attachments/${attachment_id}`,
    deleteQuote: (quote_id: string | number) => `quotes/${quote_id}`,
  },
  subCategories: {
    getSubcategoryList: `/sub-categories`,
    createSubcategory: `/sub-categories`,
    updateSubcategory: `/sub-categories`,
    subcategoryByCategory: (category_id: string | number) =>
      `/categories/${category_id}/subcategories`,
    deleteSubcategory: (subcategory_id: string | number) =>
      `/sub-categories/${subcategory_id}`,
  },
  users: {
    profileSetup: `/user/profile-setup`,
    businessProfileSetup: `/company`,
    addBusinessAddress: `/company`,
  },
} as const;
