import type { SupportTicketCreatePayload } from "@/types/api.requests.type";
import { axiosInstance } from "../axiosInstance";
import { type ApiResponse } from "@/types/api.responses.type";
import { API_ENDPOINTS } from "@/constants/endPoints";
import { ObjToFormData } from "@/lib/utils";

export const createSupportTicket = async (
  payload: SupportTicketCreatePayload,
) => {
  try {
    const res = await axiosInstance.post<ApiResponse<null>>(
      API_ENDPOINTS.support.createTicket,
      ObjToFormData(payload),
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
