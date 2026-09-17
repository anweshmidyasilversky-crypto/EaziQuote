import { showErrorToast } from "@/api/axiosInstance";
import { getQuoteDetails } from "@/api/services/quotes.api";
import { useQuery } from "@tanstack/react-query";

export type useQuoteDetailsProps = {
  quote_id: string;
};
function useQuoteDetails({ quote_id }: useQuoteDetailsProps) {
  const { data, error } = useQuery({
    queryKey: ["quote_details", quote_id],
    queryFn: () => getQuoteDetails(quote_id as string),
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    quote: data?.payload,
  };
}

export default useQuoteDetails;
