import { showErrorToast } from "@/api/axiosInstance";
import { getHomePage } from "@/api/services/auth.api";
import { useQuery } from "@tanstack/react-query";

function useHome() {
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["home"],
    queryFn: getHomePage,
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    data,
    isFetching,
    refetch,
  };
}

export default useHome;
