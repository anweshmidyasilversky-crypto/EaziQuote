import type {
  ApiResponse,
  ListResponse,
  Payment,
} from "@/types/api.responses.type";
import { axiosInstance } from "./axiosInstance";
import type { PageFilters } from "@/types/api.requests.type";

export const getPaymentListByClient = async (
  client_id: string,
  filters?: PageFilters,
) => {
  try {
    const paymentListResponse = await axiosInstance.get<
      ApiResponse<ListResponse<Payment>>
    >(`/payments`, {
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
