import { showErrorToast } from "@/api/axiosInstance";
import { getClientDetails } from "@/api/services/clients.api";
import type { PageFilters } from "@/types/api.requests.type";
import { useQuery } from "@tanstack/react-query";

export type useClientDetailsProps = {
  client_id: string;
  filters?: PageFilters;
};

function useClientDetails({ client_id, filters }: useClientDetailsProps) {
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["client_details", client_id, filters],
    queryFn: () => getClientDetails(client_id),
  });

  if (error) {
    showErrorToast(error);
  }
  return {
    clientDetails: data?.payload,
    isFetching,
    refetch,
  };
}

export default useClientDetails;
