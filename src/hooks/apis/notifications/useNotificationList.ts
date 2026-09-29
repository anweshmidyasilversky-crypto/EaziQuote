import { showErrorToast } from "@/api/axiosInstance";
import { getNotificationList } from "@/api/services/notifications.api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function useNotificationList() {
  const [pageNo, setPageNo] = useState(1);
  const {
    isFetching,
    error,
    data: notificationResponse,
    refetch,
  } = useQuery({
    queryKey: ["notifications", pageNo],
    queryFn: () =>
      getNotificationList({
        page: pageNo,
      }),
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    notifications: notificationResponse?.payload.data ?? [],
    isFetching,
    setPageNo,
    refetch,
    pagiantionMeta: notificationResponse?.payload.meta,
  };
}

export default useNotificationList;
