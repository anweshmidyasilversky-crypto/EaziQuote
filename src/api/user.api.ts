import { axiosInstance } from "./axiosInstance";
import type { ApiResponse, User } from "@/types/api.responses.type";

export const profileSetup = async (payload: FormData) => {
  try {
    const res = await axiosInstance.post<ApiResponse<Partial<User>>>(
      `/user/profile-setup`,
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
      `/company`,
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
      `/company`,
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
