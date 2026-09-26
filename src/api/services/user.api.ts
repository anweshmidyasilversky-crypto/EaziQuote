import { API_ENDPOINTS } from "@/constants/endPoints";
import { axiosInstance } from "../axiosInstance";
import type { ApiResponse, User } from "@/types/api.responses.type";

export const profileSetup = async (payload: FormData) => {
  try {
    const res = await axiosInstance.post<ApiResponse<Partial<User>>>(
      API_ENDPOINTS.users.profileSetup,
      payload,
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const businessProfileSetup = async (payload: FormData) => {
  try {
    const res = await axiosInstance.post<ApiResponse<Partial<User>>>(
      API_ENDPOINTS.users.businessProfileSetup,
      payload,
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const addBusinessAddress = async (payload: FormData) => {
  try {
    const res = await axiosInstance.post<ApiResponse<Partial<User>>>(
      API_ENDPOINTS.users.addBusinessAddress,
      {
        _method: "put",
        ...payload,
      },
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getUserDetails = async () => {
  try {
    const res = await axiosInstance.get<ApiResponse<User>>(
      API_ENDPOINTS.users.userDetails,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
