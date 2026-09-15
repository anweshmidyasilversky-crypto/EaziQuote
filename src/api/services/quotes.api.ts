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
    const { quote_id, ...patch } = payload;
    const updatedQuote = await axiosInstance.post<ApiResponse<QuoteDetails>>(
      `/quotes/${quote_id}`,
      ObjToFormData(patch),
    );
    return updatedQuote.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAttachemnt = async (payload: {
  quote_id: string | number;
  attachment_id: string | number;
}) => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/quotes/${payload.quote_id}/attachments/${payload.attachment_id}`,
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};
