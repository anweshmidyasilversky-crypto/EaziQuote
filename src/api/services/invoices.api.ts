import type { PageFilters } from "@/types/api.requests.type";
import { axiosInstance } from "../axiosInstance";
import { API_ENDPOINTS } from "@/constants/endPoints";
import type { ApiResponse, InvoiceList } from "@/types/api.responses.type";

export const getInvoiceList = async (pageFilters?: PageFilters) => {
  try {
    const invoiceListRes = await axiosInstance.get<ApiResponse<InvoiceList>>(
      API_ENDPOINTS.invoices.invoiceList,
      {
        params: pageFilters,
      },
    );
    return invoiceListRes.data;
  } catch (error) {
    throw error;
  }
};

export const deleteInvoice = async (invoiceId: string | number) => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      API_ENDPOINTS.invoices.deleteInvoice(invoiceId),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
