import { assets } from "../../assets/icons";
import { type NotificationItem } from "../../constants/dummyData";
import { getFormattedTimeDiff } from "../../lib/utils";
import { Separator } from "../ui/separator";

export type NotificationCardProps = {
  notifications: NotificationItem[];
};

export function NotificationCard({ notifications }: NotificationCardProps) {
  return (
    <div className="min-h-60 w-full flex flex-col items-center rounded-[10px] py-4.5 dashboard-card-theme gap-4.5 grow">
      {/* notification card header */}
      <div className="w-full flex justify-between px-5 items-center">
        <span className="min-h-4.75 font-medium text-[16px]">
          {" "}
          Notifications{" "}
        </span>

        <div className="flex items-center gap-1.5">
          <button className="text-american-blue font-normal text-xs cursor-pointer">
            {" "}
            View All{" "}
          </button>
          <img src={assets.arrowRightBlue} className="h-2 w-1" />
        </div>
      </div>

      <Separator className={"bg-separator w-full"} />

      {/* notification section */}
      <div className="flex flex-col gap-6 w-full px-5">
        {notifications.map((notificationObj) => {
          return (
            <div
              key={notificationObj.id}
              className="w-full flex justify-between "
            >
              <span className=" text-[16px] text-black-text">
                {" "}
                {notificationObj.notification}{" "}
              </span>
              <span className="w-fit self-start text-placeholder-text text-xs text-nowrap">
                {" "}
                {getFormattedTimeDiff(new Date(notificationObj.timestamp))}{" "}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
