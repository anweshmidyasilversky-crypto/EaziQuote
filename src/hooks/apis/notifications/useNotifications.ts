import { showErrorToast } from "@/api/axiosInstance";
import { getNotificationList } from "@/api/services/notifications.api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function useNotifications() {
  const [pageNo, setPageNo] = useState(1);
  const {
    data: notificationListResponse,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["notificationList", pageNo],
    queryFn: () =>
      getNotificationList({
        page: pageNo,
      }),
  });
  if (error) {
    showErrorToast(error);
  }
  return {
    data: notificationListResponse?.payload.data ?? [],
    isFetching,
    setPageNo,
  };
}

export default useNotifications;
