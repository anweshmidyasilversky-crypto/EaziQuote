import { API_ENDPOINTS } from "@/constants/endPoints";
import { axiosInstance } from "../axiosInstance";
import type { ApiResponse, Company, User } from "@/types/api.responses.type";

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
    const res = await axiosInstance.post<ApiResponse<Company>>(
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
    const res = await axiosInstance.post<ApiResponse<Company>>(
      API_ENDPOINTS.users.addBusinessAddress,
      payload,
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

export const deleteUser = async () => {
  try {
    const res = await axiosInstance.delete<ApiResponse<null>>(
      API_ENDPOINTS.users.deleteUser,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
