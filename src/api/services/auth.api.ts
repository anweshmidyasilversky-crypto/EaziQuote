import type { PageFilters, SignupPayload } from "@/types/api.requests.type";
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
} from "@/types/api.responses.type";
import { API_ENDPOINTS } from "@/constants/endPoints";

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

export const sendEmailVerification = async () => {
  try {
    await axiosInstance.post(API_ENDPOINTS.auth.sendVerificationEmail);
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
