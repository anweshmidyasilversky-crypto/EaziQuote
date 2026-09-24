import {
  type PaymentDetails,
  type ApiResponse,
  type ListResponse,
  type Payment,
} from "@/types/api.responses.type";
import { axiosInstance } from "../axiosInstance";
import type {
  CreatePaymentDeposit,
  CreatePaymentInvoice,
  PageFilters,
} from "@/types/api.requests.type";
import { API_ENDPOINTS } from "@/constants/endPoints";
import { ObjToFormData } from "@/lib/utils";

export const getPaymentListByClient = async (filters?: PageFilters) => {
  try {
    const paymentListResponse = await axiosInstance.get<
      ApiResponse<ListResponse<Payment>>
    >(API_ENDPOINTS.payments.getPaymentList, {
      params: {
        ...filters,
      },
    });
    return paymentListResponse.data;
  } catch (err) {
    throw err;
  }
};

export const paymentDetails = async (payment_id: string | number) => {
  try {
    const paymentDetails = await axiosInstance.get<ApiResponse<PaymentDetails>>(
      API_ENDPOINTS.payments.paymentsDetails(payment_id),
    );
    return paymentDetails.data;
  } catch (error) {
    throw error;
  }
};

export const deletePayment = async (payment_id: string | number) => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      API_ENDPOINTS.payments.deletePayment(payment_id),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPayment = async (
  payload: CreatePaymentDeposit | CreatePaymentInvoice,
) => {
  try {
    const response = await axiosInstance.post<ApiResponse<Payment>>(
      API_ENDPOINTS.payments.createPayment,
      ObjToFormData(payload),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendPaymentLink = async (paymentId: string | number) => {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>(
      API_ENDPOINTS.payments.sendPaymentEmail(paymentId),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
