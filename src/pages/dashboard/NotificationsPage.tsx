import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { CustomBtn } from "@/components/common/CustomBtn";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import useNotificationList from "@/hooks/apis/notifications/useNotificationList";
import { cn, getFormattedTimeDiff } from "@/lib/utils";
import React from "react";

function NotificationsPage() {
  const { notifications, isFetching, pagiantionMeta, setPageNo } =
    useNotificationList();

  const paginationBtns = pagiantionMeta?.links;

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

        {pagiantionMeta && (
          <div className="flex w-full justify-between items-center p-5">
            <span className="text-placeholder-text text-sm">
              {" "}
              {`Showing ${pagiantionMeta.per_page * pagiantionMeta.current_page} of ${pagiantionMeta.total} Results`}{" "}
            </span>

            {paginationBtns && (
              <div className="w-fit flex justify-between gap-2 min-h-8 items-center">
                {paginationBtns?.map((paginationBtn, index) => {
                  let label = paginationBtn.label;
                  if (index === 0) {
                    label = "Previous";
                  } else if (index === paginationBtns?.length - 1) {
                    label = "Next";
                  }
                  return (
                    <CustomBtn
                      key={label}
                      buttonLabel={label}
                      onClick={() => {
                        if (index === 0) {
                          setPageNo?.((curr) => Math.max(1, curr - 1));
                        } else if (index === paginationBtns?.length - 1) {
                          setPageNo?.((curr) =>
                            Math.min(
                              Number(pagiantionMeta?.last_page ?? 1),
                              curr + 1,
                            ),
                          );
                        } else {
                          if (!Number.isNaN(Number(label))) {
                            setPageNo?.(Number(label));
                          }
                        }
                      }}
                      btncls={cn(
                        `table-pagination-btn-common min-w-fit translate-y-0 table-pagination-btn-inactive hover:bg-transparent hover:text-black-text
                      ${paginationBtn.active ? `bg-brand-dark! text-white! max-w-8.5!` : ``}
                      ${
                        ["Previous", "Next"].includes(label)
                          ? `table-pagination-btn-common!`
                          : ``
                      } `,
                      )}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default NotificationsPage;
