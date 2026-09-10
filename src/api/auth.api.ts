import type { PageFilters, SignupPayload } from "@/types/api.requests.type";
import { axiosInstance } from "./axiosInstance";
import {
  type ApiResponse,
  type User,
  type DashboardResponse,
  type QuoteListResponse,
} from "@/types/api.responses.type";

export const signup = async (payload: SignupPayload) => {
  try {
    await axiosInstance.post(`/auth/signup`, payload);
  } catch (error) {
    throw error;
  }
};

export const login = async (payload: SignupPayload) => {
  try {
    const res = await axiosInstance.post<ApiResponse<User>>(
      `/auth/login`,
      payload,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const sendEmailVerification = async () => {
  try {
    await axiosInstance.post(`/auth/send-verification-email`);
  } catch (error) {
    throw error;
  }
};

export const getHomePage = async () => {
  try {
    const activities =
      await axiosInstance.get<ApiResponse<DashboardResponse>>(`/home`);
    return activities.data;
  } catch (error) {
    throw error;
  }
};

export const getQuoteList = async (filters: PageFilters) => {
  try {
    const quoteList = await axiosInstance.get<ApiResponse<QuoteListResponse>>(
      `/quotes`,
      {
        params: { ...filters },
      },
    );
    return quoteList.data;
  } catch (err) {
    throw err;
  }
};
