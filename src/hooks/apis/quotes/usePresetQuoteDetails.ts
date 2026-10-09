import { showErrorToast } from "@/api/axiosInstance";
import { getPresetQuoteDetails } from "@/api/services/auth.api";
import { useQuery } from "@tanstack/react-query";

export type usePresetQuoteDetailsProps = {
  templateId: string | number;
  enabled?: boolean;
  refetchOnFocus?: boolean;
};

function usePresetQuoteDetails({
  templateId,
  enabled,
  refetchOnFocus = true,
}: usePresetQuoteDetailsProps) {
  const { data, isFetching, error } = useQuery({
    queryKey: ["preset_quote_details"],
    queryFn: () => getPresetQuoteDetails(templateId),
    enabled,
    refetchOnWindowFocus: refetchOnFocus,
  });
  if (error) {
    showErrorToast(error);
  }
  return {
    presetQuote: data?.payload,
    isFetching,
  };
}

export default usePresetQuoteDetails;
