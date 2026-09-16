import type {
  ApiResponse,
  Category,
  ListResponse,
} from "@/types/api.responses.type";
import { axiosInstance } from "../axiosInstance";
import type { PageFilters } from "@/types/api.requests.type";
import { ObjToFormData } from "@/lib/utils";
import { API_ENDPOINTS } from "@/constants/endPoints";

export const getCategoryList = async (filters: PageFilters) => {
  try {
    const catListResponse = await axiosInstance.get<
      ApiResponse<ListResponse<Category>>
    >(API_ENDPOINTS.categories.getCategoryList, {
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
      API_ENDPOINTS.categories.createCategory,
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
      API_ENDPOINTS.categories.updateCategory,
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
      API_ENDPOINTS.categories.deleteCategory(id),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
