import type {
  ItemCreateApiPayload,
  PageFilters,
} from "@/types/api.requests.type";
import { axiosInstance } from "../axiosInstance";
import type {
  ApiResponse,
  ItemDetails,
  ItemImportResult,
  ListResponse,
} from "@/types/api.responses.type";
import { API_ENDPOINTS } from "@/constants/endPoints";

export const getItemList = async (filters: PageFilters) => {
  try {
    const itemsList = await axiosInstance.get<
      ApiResponse<ListResponse<ItemDetails>>
    >(`/items`, {
      params: filters,
    });
    return itemsList.data;
  } catch (err) {
    throw err;
  }
};

export const updateItem = async (
  item: Partial<ItemDetails> & { id: number | string },
) => {
  try {
    const updatedItem = await axiosInstance.post<ApiResponse<ItemDetails>>(
      `/item/create-or-update`,
      item,
    );
    return updatedItem.data;
  } catch (error) {
    throw error;
  }
};

export const createItem = async (item: ItemCreateApiPayload) => {
  try {
    const newItem = await axiosInstance.post<ApiResponse<ItemDetails>>(
      `/item/create-or-update`,
      item,
    );
    return newItem.data;
  } catch (error) {
    throw error;
  }
};

export const deleteItem = async (itemId: string | number) => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      API_ENDPOINTS.items.deleteItem(itemId),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const itemImport = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([file], { type: `application/octet-stream` }),
    );
    const response = await axiosInstance.post<ApiResponse<ItemImportResult>>(
      API_ENDPOINTS.items.itemsImport,
      formData,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSampleTemplate = async () => {
  try {
    const response = await axiosInstance.get<Blob>(
      API_ENDPOINTS.items.sampleTemplate,
      {
        params: {
          secure_token: import.meta.env.VITE_AWS_S3_TOKEN,
        },
        responseType: "blob",
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
