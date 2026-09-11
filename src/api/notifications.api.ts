import type { PageFilters } from "@/types/api.requests.type";
import { axiosInstance } from "./axiosInstance";
import {
  type ApiResponse,
  type NotificationListResponse,
} from "@/types/api.responses.type";

export const getNotificationList = async (filters?: PageFilters) => {
  try {
    const notificationResponse = await axiosInstance.get<
      ApiResponse<NotificationListResponse>
    >(`/notifications`, {
      params: { ...filters },
    });
    return notificationResponse.data;
  } catch (err) {
    throw err;
  }
};
