import { showErrorToast } from "@/api/axiosInstance";
import { getQuoteDetails } from "@/api/services/quotes.api";
import { useQuery } from "@tanstack/react-query";

export type useQuoteDetailsProps = {
  quote_id: string;
  enabled?: boolean;
};
function useQuoteDetails({ quote_id, enabled = true }: useQuoteDetailsProps) {
  const { data, error, isFetching } = useQuery({
    queryKey: ["quote_details", quote_id],
    queryFn: () => getQuoteDetails(quote_id as string),
    enabled,
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    quote: data?.payload,
    isFetching,
  };
}

export default useQuoteDetails;
