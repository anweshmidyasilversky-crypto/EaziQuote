import {
  type ApiResponse,
  type QuoteDetails,
} from "@/types/api.responses.type";
import { axiosInstance } from "./axiosInstance";
import type {
  CreateQuoteApiPayload,
  UpdateQuoteApiPayload,
} from "@/types/api.requests.type";
import { ObjToFormData } from "@/lib/utils";

export const getQuoteDetails = async (quote_id: string | number) => {
  try {
    const quote = await axiosInstance.get<ApiResponse<QuoteDetails>>(
      `/quotes/${quote_id}`,
    );
    return quote.data;
  } catch (err) {
    throw err;
  }
};

export const createQuote = async (payload: CreateQuoteApiPayload) => {
  try {
    const newQuote = await axiosInstance.post<ApiResponse<QuoteDetails>>(
      `/quotes`,
      ObjToFormData(payload),
    );
    return newQuote.data;
  } catch (err) {
    throw err;
  }
};

export const updateQuote = async (payload: UpdateQuoteApiPayload) => {
  try {
    const updatedQuote = await axiosInstance.post<ApiResponse<QuoteDetails>>(
      `/quotes`,
      ObjToFormData(payload),
    );
    return updatedQuote.data;
  } catch (error) {
    throw error;
  }
};
