import { updateNotificationSettings } from "@/api/services/auth.api";
import type { NotificationSettingsUpdate } from "@/types/api.requests.type";
import { useMutation } from "@tanstack/react-query";

function useConfigMutations() {
  const notificationSettingsMutation = useMutation({
    mutationKey: ["config_update"],
    mutationFn: (payload: NotificationSettingsUpdate) => {
      return updateNotificationSettings(payload);
    },
  });
  return {
    notificationSettingsMutation,
  };
}

export default useConfigMutations;
