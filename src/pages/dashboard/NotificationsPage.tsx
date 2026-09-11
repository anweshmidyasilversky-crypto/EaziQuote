import { showErrorToast } from "@/api/axiosInstance";
import { getNotificationList } from "@/api/notifications.api";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { CustomBtn } from "@/components/common/CustomBtn";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { getFormattedTimeDiff } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

function NotificationsPage() {
  const [pageNo, setPageNo] = useState(1);

  const {
    isFetching,
    error,
    data: notificationResponse,
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

  const notifications = notificationResponse?.payload.data;

  const paginationInfo = notificationResponse?.payload.meta;

  return (
    <>
      <HeaderBreadCrumb pageName="Notifications" />
      <div className="flex flex-col gap-5 m-6 bg-white rounded-[10px]">
        <div className="p-5 flex flex-col gap-6 [&_span]:text-base">
          {isFetching && (
            <Spinner className="text-brand-dark w-20 h-20 self-center" />
          )}
          {notifications && (notifications?.length ?? 0) > 0 && (
            <>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <div className="flex justify-between">
                    <span> {notification.message} </span>
                    <span>
                      {" "}
                      {getFormattedTimeDiff(notification.created_at)}{" "}
                    </span>
                  </div>
                  {index < notifications.length - 1 && (
                    <Separator className={`bg-separator`} />
                  )}
                </React.Fragment>
              ))}
            </>
          )}
          {!isFetching && (!notifications || !notifications.length) && (
            <div className="flex justify-center"> No data found </div>
          )}
        </div>

        {paginationInfo && (
          <div className="flex w-full justify-between">
            <span className="text-placeholder-text">
              {" "}
              {`Showing ${paginationInfo.last_page * paginationInfo.per_page} of ${paginationInfo.total} Results`}{" "}
            </span>

            <div className="[&_button]:trnaslate-y-0! [&_button]:table-pagination-btn-common [&_button]:disabled:table-pagination-btn-inactive">
              {paginationInfo.links.map((btnConfig, index) => {
                if (index === 0) {
                  return (
                    <CustomBtn
                      key={btnConfig.label.replaceAll(" ", "-")}
                      buttonLabel="Previous"
                      disabled={!btnConfig.active}
                      onClick={() => setPageNo((curr) => Math.max(0, curr - 1))}
                    />
                  );
                } else if (index === paginationInfo.links.length - 1) {
                  return (
                    <CustomBtn
                      buttonLabel="Next"
                      key={btnConfig.label.replaceAll(" ", "-")}
                      disabled={!btnConfig.active}
                      onClick={() =>
                        setPageNo((curr) =>
                          Math.min(paginationInfo.last_page, curr + 1),
                        )
                      }
                    />
                  );
                } else {
                  <CustomBtn
                    buttonLabel={btnConfig.label}
                    key={btnConfig.label.replaceAll(" ", "-")}
                    disabled={!btnConfig.active}
                    onClick={() => setPageNo(Number(btnConfig.label))}
                  />;
                }
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default NotificationsPage;
