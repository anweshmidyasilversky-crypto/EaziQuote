import { showErrorToast } from "@/api/axiosInstance";
import { getUserDetails } from "@/api/services/user.api";
import { useQuery } from "@tanstack/react-query";

function useUserDetails() {
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["user_details"],
    queryFn: getUserDetails,
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    userDetails: data?.payload,
    isFetching,
    refetch,
  };
}

export default useUserDetails;
