import type { ProfileCreateApiPayload } from "@/types/userProfile.payload.type";
import { axiosInstance } from "./axiosInstance";
import type { ApiResponse, User } from "@/types/api.responses.type";
import type { BuisnessProfileApiPayload } from "@/types/businessProfile.payload.type";

export const profileSetup = async (payload: ProfileCreateApiPayload) => {
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

export const businessProfileSetup = async (payload: BuisnessProfileApiPayload) => {
    try {
        const res = await 
    }
}