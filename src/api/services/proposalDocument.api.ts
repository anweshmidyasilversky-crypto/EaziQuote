import type {
  CreateOrUpdateSectionForQuote,
  PageFilters,
  QuoteSectionCreatePayload,
  QuoteSectionUpdatePayload,
} from "@/types/api.requests.type";
import { axiosInstance } from "../axiosInstance";
import { API_ENDPOINTS } from "@/constants/endPoints";
import { ObjToFormData } from "@/lib/utils";
import {
  type ApiResponse,
  type ListResponse,
  type QuoteSection,
} from "@/types/api.responses.type";

export const getQuoteSectionList = async (filters?: PageFilters) => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<{ data: QuoteSection[] }>
    >(API_ENDPOINTS.proposalDocuments.getProposalDocumentList, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSectionListByQuote = async (
  quote_id: string | number,
  filters?: PageFilters,
) => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<ListResponse<QuoteSection>>
    >(API_ENDPOINTS.proposalDocuments.getProposalDocForQuote(quote_id), {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSection = async (payload: QuoteSectionCreatePayload) => {
  try {
    const response = await axiosInstance.post<ApiResponse<QuoteSection>>(
      API_ENDPOINTS.proposalDocuments.createOrUpdateProposalDocument,
      ObjToFormData(payload),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSection = async (payload: QuoteSectionUpdatePayload) => {
  try {
    const response = await axiosInstance.post<ApiResponse<QuoteSection>>(
      API_ENDPOINTS.proposalDocuments.createOrUpdateProposalDocument,
      ObjToFormData(payload),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSection = async (id: string) => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      API_ENDPOINTS.proposalDocuments.deleteProposalDocument(id),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSectionByQuote = async (quote_id: string | number) => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<ListResponse<QuoteSection>>
    >(API_ENDPOINTS.proposalDocuments.getProposalDocForQuote(quote_id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrUpdateSectionForQuote = async (
  payload: CreateOrUpdateSectionForQuote,
) => {
  try {
    const { quote_id, ...rest } = payload;
    const response = await axiosInstance.post<
      ApiResponse<ListResponse<QuoteSection>>
    >(
      API_ENDPOINTS.proposalDocuments.createOrUpdateProposalDocForQuote(
        quote_id,
      ),
      rest,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSectionForQuote = async (payload: {
  quote_id: string | number;
  section_id: string | number;
}) => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      API_ENDPOINTS.proposalDocuments.deleteProposalDocumentForQuote(
        payload.section_id,
        payload.quote_id,
      ),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
