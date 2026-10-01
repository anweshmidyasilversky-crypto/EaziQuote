import { showErrorToast } from "@/api/axiosInstance";
import { assets } from "@/assets/icons";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import useConfigMutations from "@/hooks/apis/appConfig/useConfigMutations";
import { updateConfig } from "@/redux/slices/settings.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import React, { useRef } from "react";
import { toast } from "react-toastify";

function NotificationPreferencesPage() {
  const { notification_settings } = useAppSelector((state) => state.appConfig);
  const dispatch = useAppDispatch();
  const { notificationSettingsMutation } = useConfigMutations();
  const toggleConfig: {
    id: string;
    label: string;
    icon: string;
    onClick?: () => void;
  }[] = [
    {
      id: "push_notification_enabled",
      label: "Push Notifications",
      icon: assets.bellIcon,
    },
    {
      id: "email_notification_enabled",
      label: "Email Updates",
      icon: assets.emailIcon,
    },
  ];

  const targetId = useRef<string>("");

  const handleCheckedChange = (id: string, state: boolean) => {
    notificationSettingsMutation.mutate(
      {
        push_notification_enabled:
          id === `push_notification_enabled`
            ? Number(state)
            : Number(notification_settings.push_notification_enabled),

        email_notification_enabled:
          id === `email_notification_enabled`
            ? Number(state)
            : Number(notification_settings.email_notification_enabled),
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          dispatch(updateConfig(response.payload));
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

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
              <Switch
                className="w-9.5 aspect-auto"
                withLabel={false}
                checked={
                  notification_settings[
                    config.id as keyof typeof notification_settings
                  ]
                }
                onCheckedChange={(state) => {
                  targetId.current = config.id;
                  handleCheckedChange(config.id, state);
                }}
                isTansitioning={
                  targetId.current === config.id &&
                  notificationSettingsMutation.isPending
                }
              />
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
