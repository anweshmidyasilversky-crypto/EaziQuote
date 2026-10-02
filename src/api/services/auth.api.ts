import type {
  BillingDetailsApiPayload,
  BillingPreferenceApiPayload,
  ChangePasswordApiPayload,
  CompanyCreateApiPayload,
  CompanyUpdateApiPayload,
  CreatePresetQuote,
  NotificationSettingsUpdate,
  PageFilters,
  QuoteInvoiceSettingsApiPayload,
  SignupPayload,
  UpdatePresetQuote,
} from "@/types/api.requests.type";
import { axiosInstance } from "../axiosInstance";
import {
  type ApiResponse,
  type User,
  type DashboardResponse,
  type QuoteListResponse,
  type ListResponse,
  type PresetQuoteListing,
  type AppConfig,
  type PresetQuote,
  type Company,
  type BillingDetailsResponse,
} from "@/types/api.responses.type";
import { API_ENDPOINTS } from "@/constants/endPoints";
import { ObjToFormData } from "@/lib/utils";

export const signup = async (payload: SignupPayload) => {
  try {
    await axiosInstance.post(API_ENDPOINTS.auth.signup, payload);
  } catch (error) {
    throw error;
  }
};

export const login = async (payload: SignupPayload) => {
  try {
    const res = await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.auth.login,
      payload,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const sendEmailVerification = async (verificationToken: string) => {
  try {
    await axiosInstance.post(
      API_ENDPOINTS.auth.sendVerificationEmail,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${verificationToken}`,
        },
      },
    );
  } catch (error) {
    throw error;
  }
};

export const getHomePage = async () => {
  try {
    const activities = await axiosInstance.get<ApiResponse<DashboardResponse>>(
      API_ENDPOINTS.auth.home,
    );
    return activities.data;
  } catch (error) {
    throw error;
  }
};

export const getQuoteList = async (filters?: PageFilters) => {
  try {
    const quoteList = await axiosInstance.get<ApiResponse<QuoteListResponse>>(
      API_ENDPOINTS.auth.quoteList,
      {
        params: { ...filters },
      },
    );
    return quoteList.data;
  } catch (err) {
    throw err;
  }
};

export const getPresetQuoteList = async (filters?: PageFilters) => {
  try {
    const quoteList = await axiosInstance.get<
      ApiResponse<ListResponse<PresetQuoteListing>>
    >(API_ENDPOINTS.auth.presetQuotes, {
      params: filters,
    });
    return quoteList.data;
  } catch (err) {
    throw err;
  }
};

export const createPresetQuote = async (payload: CreatePresetQuote) => {
  try {
    const presetQuote = await axiosInstance.post<ApiResponse<PresetQuote>>(
      API_ENDPOINTS.auth.createPresetQuote,
      payload,
    );
    return presetQuote.data;
  } catch (error) {
    throw error;
  }
};

export const updatePresetQuote = async (payload: UpdatePresetQuote) => {
  try {
    const presetQuote = await axiosInstance.post<ApiResponse<PresetQuote>>(
      API_ENDPOINTS.auth.updatePresetQuote,
      payload,
    );
    return presetQuote.data;
  } catch (error) {
    throw error;
  }
};

export const getPresetQuoteDetails = async (templateId: string | number) => {
  try {
    const quote = await axiosInstance.get<ApiResponse<PresetQuote>>(
      API_ENDPOINTS.auth.presetQuoteDetails(templateId),
    );
    return quote.data;
  } catch (error) {
    throw error;
  }
};

export const deletePresetQuote = async (templateId: string | number) => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      API_ENDPOINTS.auth.deletePresetQuote(templateId),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAppConfig = async () => {
  try {
    const appConfigResponse = await axiosInstance.get<ApiResponse<AppConfig>>(
      API_ENDPOINTS.auth.appConfig,
    );
    return appConfigResponse.data;
  } catch (error) {
    throw error;
  }
};

export const createCompany = async (payload: CompanyCreateApiPayload) => {
  try {
    const res = await axiosInstance.post<ApiResponse<Company>>(
      API_ENDPOINTS.auth.companyCreate,
      ObjToFormData(payload),
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateCompany = async (payload: CompanyUpdateApiPayload) => {
  try {
    const res = await axiosInstance.post<ApiResponse<Company>>(
      API_ENDPOINTS.auth.companyUpdate,
      ObjToFormData(payload),
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateNotificationSettings = async (
  payload: NotificationSettingsUpdate,
) => {
  try {
    const res = await axiosInstance.patch<ApiResponse<AppConfig>>(
      API_ENDPOINTS.auth.notificationSettingsUpdate,
      payload,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (payload: ChangePasswordApiPayload) => {
  try {
    const res = await axiosInstance.post<ApiResponse<null>>(
      API_ENDPOINTS.auth.changePassword,
      ObjToFormData(payload),
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const res = await axiosInstance.post<ApiResponse<null>>(
      API_ENDPOINTS.auth.logout,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateBillingDetails = async (
  payload: BillingDetailsApiPayload,
) => {
  try {
    const res = await axiosInstance.post<ApiResponse<BillingDetailsResponse>>(
      API_ENDPOINTS.auth.updateBillingDetails,
      ObjToFormData(payload),
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateBillingPreference = async (
  payload: BillingPreferenceApiPayload,
) => {
  try {
    const response = await axiosInstance.post<ApiResponse<AppConfig>>(
      API_ENDPOINTS.auth.billingPreference,
      ObjToFormData(payload),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateQuoteInvoiceSettings = async (
  payload: QuoteInvoiceSettingsApiPayload,
) => {
  try {
    const formData = new FormData();
    formData.append(`terms_and_conditions`, payload.terms_and_conditions);
    formData.append(`footer_message`, payload.footer_message);
    if (payload.signature) {
      formData.append(`signature`, payload.signature);
    }
    const response = await axiosInstance.post<ApiResponse<AppConfig>>(
      API_ENDPOINTS.auth.invoiceSettings,
      formData,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
