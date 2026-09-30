import { showErrorToast } from "@/api/axiosInstance";
import { getAppConfig } from "@/api/services/auth.api";
import { useAppSelector } from "@/redux/store";
import { useQuery } from "@tanstack/react-query";

export type useAppConfigProps = {
  enabled?: boolean;
};

function useAppConfig({ enabled = true }: useAppConfigProps = {}) {
  const apiToken = useAppSelector((state) => state.auth.apiToken);
  const { data: appConfigResponse, error } = useQuery({
    queryKey: ["appConfig", apiToken],
    queryFn: getAppConfig,
    enabled: enabled && Boolean(apiToken),
  });

  if (error) {
    showErrorToast(error);
  }

  return appConfigResponse;
}

export default useAppConfig;
