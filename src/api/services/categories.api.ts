import type {
  ApiResponse,
  Category,
  ListResponse,
} from "@/types/api.responses.type";
import { axiosInstance } from "./axiosInstance";
import type { PageFilters } from "@/types/api.requests.type";
import { ObjToFormData } from "@/lib/utils";

export const getCategoryList = async (filters: PageFilters) => {
  try {
    const catListResponse = await axiosInstance.get<
      ApiResponse<ListResponse<Category>>
    >(`/categories`, {
      params: filters,
    });
    return catListResponse.data;
  } catch (error) {
    throw error;
  }
};

export const createCategory = async (name: string) => {
  try {
    const newCategory = await axiosInstance.post<ApiResponse<Category>>(
      `/categories`,
      ObjToFormData({ name }),
    );
    return newCategory.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (payload: { id: number; name: string }) => {
  try {
    const updatedCategory = await axiosInstance.post<ApiResponse<Category>>(
      `/categories`,
      ObjToFormData(payload),
    );
    return updatedCategory.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id: number | string) => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/categories/${id}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
