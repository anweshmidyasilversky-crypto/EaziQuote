import type {
  PageFilters,
  SubCategoryCreateApiPayload,
  subCategoryUpdateApiPayload,
} from "@/types/api.requests.type";
import { axiosInstance } from "./axiosInstance";
import { ObjToFormData } from "@/lib/utils";
import {
  type ListResponse,
  type ApiResponse,
  type Subcategory,
} from "@/types/api.responses.type";

export const getSubCatList = async (filters: PageFilters) => {
  try {
    const catListResponse = await axiosInstance.get<
      ApiResponse<ListResponse<Subcategory>>
    >(`/sub-categories`, {
      params: filters,
    });
    return catListResponse.data;
  } catch (error) {
    throw error;
  }
};

export const createSubCategory = async (
  payload: SubCategoryCreateApiPayload,
) => {
  try {
    const newSubCategory = await axiosInstance.post<ApiResponse<Subcategory>>(
      `/sub-categories`,
      ObjToFormData(payload),
    );
    return newSubCategory.data;
  } catch (error) {
    throw error;
  }
};

export const updateSubCategory = async (
  payload: subCategoryUpdateApiPayload,
) => {
  try {
    const updatedSubCategory = await axiosInstance.post(
      `/sub-categories`,
      ObjToFormData(payload),
    );
    return updatedSubCategory.data;
  } catch (error) {
    throw error;
  }
};

export const subCategoryByCategory = async (
  categoryId: string | number,
  filter?: PageFilters,
) => {
  try {
    const subCategories = await axiosInstance.get<ApiResponse<Subcategory[]>>(
      `/categories/${categoryId}/subcategories`,
      { params: filter },
    );
    return subCategories.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSubCategory = async (subCatId: string | number) => {
  try {
    const response = await axiosInstance.delete(`/sub-categories/${subCatId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
