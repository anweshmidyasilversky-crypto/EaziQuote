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
  const {
    invoice_id,
    items,
    attachments,
    is_company_phone_number_show,
    ...patch
  } = payload;

  const formData = new FormData();

  formData.append(
    "is_company_phone_number_show",
    is_company_phone_number_show ? "1" : "0",
  );

  attachments?.forEach((attachment) => {
    formData.append(
      `attachments[]`,
      new Blob([attachment], { type: attachment.type }),
    );
  });

  Object.entries(patch).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    } else if (Array.isArray(value)) {
      value.forEach((val) => formData.append(`${String(key)}[]`, val));
    }

    formData.append(key, String(value));
  });

  items?.forEach((item, index) => {
    if (item.quantity > 0) {
      Object.entries(item).forEach(([itemKey, value]) => {
        if (value === undefined || value === null) {
          return;
        }

        formData.append(`items[${index}][${itemKey}]`, String(value));
      });
    }
  });

  // console.log("=== FormData ===");

  // for (const [key, value] of formData.entries()) {
  //   console.log(key, value);
  // }

  const response = await axiosInstance.post<ApiResponse<InvoiceDetails>>(
    API_ENDPOINTS.invoices.invoiceDetails(invoice_id),
    formData,
  );

  return response.data;
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

export const downloadInvoicePdf = async (invoice_id: string | number) => {
  try {
    const response = await axiosInstance.get<Blob>(
      API_ENDPOINTS.invoices.invoicePdfDownload(invoice_id),
      {
        params: {
          is_download: 1,
        } as PageFilters,
        responseType: "blob",
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
