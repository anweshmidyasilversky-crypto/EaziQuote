import { useNavigate } from "react-router";
import { assets } from "../../assets/icons";
import { getFormattedTimeDiff } from "../../lib/utils";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";
import type { Notification } from "@/types/api.responses.type";

export type NotificationCardProps = {
  notifications: Notification[];
  isFetching?: boolean;
};

export function NotificationCard({
  notifications,
  isFetching,
}: NotificationCardProps) {
  const navigate = useNavigate();
  return (
    <div className="min-w-120 min-h-60 overflow-y-auto w-full flex flex-col items-center rounded-[10px] py-4.5 dashboard-card-theme gap-4.5 grow">
      {/* notification card header */}
      <div className="w-full flex justify-between px-5 items-center">
        <span className="min-h-4.75 font-medium text-[16px]">
          {" "}
          Notifications{" "}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            className="text-american-blue font-normal text-xs cursor-pointer"
            onClick={() => navigate(`/dashboard/notifications`)}
          >
            {" "}
            View All{" "}
          </button>
          <img src={assets.arrowRightBlue} className="h-2 w-1" />
        </div>
      </div>

      <Separator className={"bg-separator w-full"} />

      {/* notification section */}
      <div className="flex flex-col justify-between gap-6 w-full px-5">
        {isFetching ? (
          <Spinner className="text-brand-dark w-6 h-6 self-center" />
        ) : (
          <>
            {notifications.map((notificationObj) => {
              return (
                <div
                  key={notificationObj.id ?? notificationObj.created_at}
                  className="w-full flex justify-between gap-5"
                >
                  <span className=" text-[16px] text-black-text">
                    {" "}
                    {notificationObj.message}{" "}
                  </span>
                  <span className="w-fit self-start text-placeholder-text text-xs text-nowrap">
                    {" "}
                    {getFormattedTimeDiff(
                      new Date(notificationObj.created_at),
                    )}{" "}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
