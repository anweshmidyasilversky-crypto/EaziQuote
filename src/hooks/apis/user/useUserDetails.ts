import { showErrorToast } from "@/api/axiosInstance";
import { getUserDetails } from "@/api/services/user.api";
import { useAppSelector } from "@/redux/store";
import { useQuery } from "@tanstack/react-query";

export type useUserDetailsProps = {
  enabled?: boolean;
};

function useUserDetails({ enabled = true }: useUserDetailsProps) {
  const apiToken = useAppSelector((state) => state.auth.apiToken);
  const {
    data,
    isFetching,
    isLoading,
    isError,
    isFetchedAfterMount,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user_details", apiToken],
    queryFn: getUserDetails,
    enabled: enabled && Boolean(apiToken),
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    userDetails: data?.payload,
    isFetching,
    isLoading,
    isError,
    isFetchedAfterMount,
    refetch,
  };
}

export default useUserDetails;
