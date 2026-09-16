import type { PageFilters } from "@/types/api.requests.type";
import { axiosInstance } from "../axiosInstance";
import {
  type ApiResponse,
  type ListResponse,
  type Notification,
} from "@/types/api.responses.type";
import { API_ENDPOINTS } from "@/constants/endPoints";

export const getNotificationList = async (filters?: PageFilters) => {
  try {
    const notificationResponse = await axiosInstance.get<
      ApiResponse<ListResponse<Notification>>
    >(API_ENDPOINTS.notifications.getNotificationList, {
      params: { ...filters },
    });
    return notificationResponse.data;
  } catch (err) {
    throw err;
  }
};
