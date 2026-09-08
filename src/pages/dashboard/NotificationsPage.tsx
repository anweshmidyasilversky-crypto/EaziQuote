import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { Separator } from "@/components/ui/separator";
import { notifications } from "@/constants/dummyData";
import { getFormattedTimeDiff } from "@/lib/utils";
import React from "react";

function NotificationsPage() {
  return (
    <>
      <HeaderBreadCrumb pageName="Notifications" />
      <div className="m-6 p-5 flex flex-col gap-6 bg-white rounded-[10px] [&_span]:text-base">
        {notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <div className="flex justify-between">
              <span> {notification.notification} </span>
              <span> {getFormattedTimeDiff(notification.timestamp)} </span>
            </div>
            {index < notifications.length - 1 && (
              <Separator className={`bg-separator`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

export default NotificationsPage;
