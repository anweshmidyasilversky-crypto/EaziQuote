import type {
  InvoiceCreateApiPayload,
  InvoiceUpdateApiPayload,
  PageFilters,
} from "@/types/api.requests.type";
import { axiosInstance } from "../axiosInstance";
import { API_ENDPOINTS } from "@/constants/endPoints";
import {
  type InvoiceDetails,
  type ApiResponse,
  type InvoiceList,
  InvoiceStatus,
} from "@/types/api.responses.type";
import { ObjToFormData } from "@/lib/utils";

export const getInvoiceList = async (pageFilters?: PageFilters) => {
  try {
    const invoiceListRes = await axiosInstance.get<ApiResponse<InvoiceList>>(
      API_ENDPOINTS.invoices.invoiceList,
      {
        params: { ...pageFilters },
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

export const getInvoiceDetails = async (invoiceId: string | number) => {
  try {
    const response = await axiosInstance.get<ApiResponse<InvoiceDetails>>(
      API_ENDPOINTS.invoices.invoiceDetails(invoiceId),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createInvoice = async (payload: InvoiceCreateApiPayload) => {
  try {
    const response = await axiosInstance.post<ApiResponse<InvoiceDetails>>(
      API_ENDPOINTS.invoices.invoiceCreate,
      ObjToFormData(payload),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateInvoice = async (
  payload: InvoiceUpdateApiPayload & {
    invoice_id: string | number;
  },
) => {
  try {
    const { invoice_id, ...patch } = payload;
    const response = await axiosInstance.post<ApiResponse<InvoiceDetails>>(
      API_ENDPOINTS.invoices.invoiceDetails(invoice_id),
      patch,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateInvoiceStatus = async (payload: {
  status: InvoiceStatus;
  invoice_id: string | number;
}) => {
  try {
    const response = await axiosInstance.patch<ApiResponse<null>>(
      API_ENDPOINTS.invoices.updateStatus,
      payload,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendInvoiceEmail = async (invoice_id: string | number) => {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>(
      API_ENDPOINTS.invoices.sendEmail(invoice_id),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getInvoicePreview = async (
  pathVariables: {
    invoice_id: string | number;
    hash: string;
  },
  filters?: PageFilters,
) => {
  try {
    const { invoice_id, hash } = pathVariables;
    const response = await axiosInstance.get<ApiResponse<string>>(
      API_ENDPOINTS.invoices.invoicePreview(invoice_id, hash),
      {
        params: filters,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateInvoicePdf = async (
  invoice_id: string | number,
  filters?: PageFilters,
) => {
  try {
    const response = await axiosInstance.get<HTMLDocument | string>(
      API_ENDPOINTS.invoices.invoicePdfGenerate(invoice_id),
      {
        params: filters,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
