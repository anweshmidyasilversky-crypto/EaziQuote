import { showErrorToast } from "@/api/axiosInstance";
import { getOfferings } from "@/api/services/revenewCat.api";
import { useQuery } from "@tanstack/react-query";

export type useOfferListingsProps = {
  userId: number;
  enabled?: boolean;
};

function useOfferListings({ userId, enabled }: useOfferListingsProps) {
  const { data, isFetching, error } = useQuery({
    queryKey: ["subscription_offerings"],
    queryFn: () => getOfferings(userId),
    enabled,
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    offerings: data,
    isFetching,
  };
}

export default useOfferListings;
