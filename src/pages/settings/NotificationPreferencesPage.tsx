import { assets } from "@/assets/icons";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import React from "react";

function NotificationPreferencesPage() {
  const toggleConfig: {
    id: string;
    label: string;
    icon: string;
    onClick?: () => void;
  }[] = [
    {
      id: "Push Notifications",
      label: "Push Notifications",
      icon: assets.bellIcon,
    },
    {
      id: "Email Updates",
      label: "Email Updates",
      icon: assets.emailIcon,
    },
  ];
  return (
    <>
      <HeaderBreadCrumb pageName="Notifications preference" />

      <div className="m-6 p-5 rounded-[10px] bg-white flex flex-col gap-5">
        {toggleConfig.map((config, index) => (
          <React.Fragment key={config.id}>
            <div className="w-full flex justify-between">
              <div className="flex gap-3 items-center">
                <div className="bg-settings-card-secondary h-7 w-7 flex items-center justify-center rounded-[7px]">
                  <img src={config.icon} className="h-4 aspect-auto" />
                </div>
                <span className="text-sm text-nowrap"> {config.label} </span>
              </div>
              <Switch className="w-9.5 aspect-auto" />
            </div>

            {index < toggleConfig.length - 1 && (
              <Separator className={`bg-separator`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

export default NotificationPreferencesPage;
