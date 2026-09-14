import type { PageFilters } from "@/types/api.requests.type";
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
