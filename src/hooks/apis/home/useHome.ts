import { showErrorToast } from "@/api/axiosInstance";
import { getHomePage } from "@/api/services/auth.api";
import { useQuery } from "@tanstack/react-query";

function useHome() {
  const { data, isFetching, error } = useQuery({
    queryKey: ["home"],
    queryFn: getHomePage,
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    data,
    isFetching,
  };
}

export default useHome;
