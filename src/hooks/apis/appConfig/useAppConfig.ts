import { showErrorToast } from "@/api/axiosInstance";
import { getAppConfig } from "@/api/services/auth.api";
import { useQuery } from "@tanstack/react-query";

function useAppConfig() {
  const { data: appConfigResponse, error } = useQuery({
    queryKey: ["appConfig"],
    queryFn: getAppConfig,
  });

  if (error) {
    showErrorToast(error);
  }

  return appConfigResponse;
}

export default useAppConfig;
