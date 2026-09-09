import type { SignupPayload } from "@/types/api.requests.type";
import { axiosInstance } from "./axiosInstance";
import type { ApiResponse, User } from "@/types/api.responses.type";

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
