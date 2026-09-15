import type {
  ItemCreateApiPayload,
  PageFilters,
} from "@/types/api.requests.type";
import { axiosInstance } from "./axiosInstance";
import type {
  ApiResponse,
  ItemDetails,
  ListResponse,
} from "@/types/api.responses.type";

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

export const deleteItem = async (itemId: string | number) => {};
