import {
  type BillingInvoiceItem,
  type ApiResponse,
  type ListResponseItem,
} from "@/types/api.responses.type";
import { axiosInstance } from "../axiosInstance";
import { API_ENDPOINTS } from "@/constants/endPoints";
import type { PageFilters } from "@/types/api.requests.type";

export const getBillingInvoiceList = async (filters?: PageFilters) => {
  try {
    const invoiceList = await axiosInstance.get<
      ApiResponse<ListResponseItem<BillingInvoiceItem>>
    >(API_ENDPOINTS.subscription.billingHistory, {
      params: filters,
    });
    return invoiceList.data;
  } catch (error) {
    throw error;
  }
};

export const getInvoiceBillDownload = async (invoice_url: string) => {
  try {
    const response = await axiosInstance.post<Blob>(
      API_ENDPOINTS.subscription.billDownload,
      {
        invoice_url,
      },
      {
        responseType: "blob",
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
