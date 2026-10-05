import type { ApiResponse, StripeOnboard } from "@/types/api.responses.type";
import { axiosInstance, showErrorToast } from "../axiosInstance";
import { API_ENDPOINTS } from "@/constants/endPoints";

export const onboardUser = async () => {
  try {
    const res = await axiosInstance.post<ApiResponse<StripeOnboard>>(
      API_ENDPOINTS.strip.onboard,
    );
    return res.data;
  } catch (error) {
    showErrorToast(error);
  }
};
