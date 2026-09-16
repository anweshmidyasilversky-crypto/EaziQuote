import type {
  ApiResponse,
  ListResponse,
  Payment,
} from "@/types/api.responses.type";
import { axiosInstance } from "../axiosInstance";
import type { PageFilters } from "@/types/api.requests.type";
import { API_ENDPOINTS } from "@/constants/endPoints";

export const getPaymentListByClient = async (
  client_id: string | number,
  filters?: PageFilters,
) => {
  try {
    const paymentListResponse = await axiosInstance.get<
      ApiResponse<ListResponse<Payment>>
    >(API_ENDPOINTS.payments.getPaymentList, {
      params: {
        client_id,
        ...filters,
      },
    });
    return paymentListResponse.data;
  } catch (err) {
    throw err;
  }
};
