import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { CustomBtn } from "@/components/common/CustomBtn";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import useNotificationList from "@/hooks/apis/notifications/useNotificationList";
import { cn } from "@/lib/utils/helper";
import { getFormattedTimeDiff } from "@/lib/utils/date";
import { nanoid } from "@reduxjs/toolkit";
import { getPageItems } from "@/lib/utils/pagination";
import React from "react";

function NotificationsPage() {
  const { notifications, isFetching, pagiantionMeta, setPageNo } =
    useNotificationList();

  const lastPage = Number(pagiantionMeta?.last_page ?? 0);
  const currentPage = Number(pagiantionMeta?.current_page ?? 0);
  const pageItems = getPageItems(currentPage, lastPage);

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
                <React.Fragment key={notification.id ?? nanoid()}>
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

        {pagiantionMeta && (
          <div className="w-full flex justify-end items-center pb-5 px-5">
            {pagiantionMeta.from && pagiantionMeta.to && (
              <span className="w-full self-stretch text-sm text-placeholder-text flex items-center">
                {" "}
                {`Showing ${pagiantionMeta.to} of ${pagiantionMeta.total} Results`}{" "}
              </span>
            )}
            <div className="flex gap-2 items-center">
              <CustomBtn
                buttonLabel="Previous"
                onClick={() => currentPage > 1 && setPageNo(currentPage - 1)}
                btncls="table-pagination-btn-common min-w-fit translate-y-0 table-pagination-btn-inactive hover:bg-transparent hover:text-black-text"
              />

              {pageItems.map((item) =>
                typeof item === "string" ? (
                  <span
                    key={item}
                    className="px-2 text-placeholder-text select-none"
                  >
                    ...
                  </span>
                ) : (
                  <CustomBtn
                    key={item}
                    buttonLabel={String(item)}
                    onClick={() => setPageNo(item)}
                    btncls={cn(
                      "table-pagination-btn-common min-w-fit translate-y-0 table-pagination-btn-inactive hover:bg-transparent hover:text-black-text",
                      item === currentPage &&
                        "bg-brand-dark! text-white! max-w-8.5!",
                    )}
                  />
                ),
              )}

              <CustomBtn
                buttonLabel="Next"
                onClick={() =>
                  currentPage < lastPage && setPageNo(currentPage + 1)
                }
                btncls="table-pagination-btn-common min-w-fit translate-y-0 table-pagination-btn-inactive hover:bg-transparent hover:text-black-text"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default NotificationsPage;
