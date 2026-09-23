import { showErrorToast } from "@/api/axiosInstance";
import { getPreviewPdf } from "@/api/services/quotes.api";
import { useQuery } from "@tanstack/react-query";

export type useQuotePreviewProps = {
  quote_id: string | number;
  enabled: boolean;
};

function useQuotePreview({ quote_id, enabled }: useQuotePreviewProps) {
  const { data, isFetching, error } = useQuery({
    queryKey: ["quote_preview"],
    queryFn: () => getPreviewPdf(quote_id),
    enabled,
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    previewHtml: data,
    isFetching,
  };
}

export default useQuotePreview;
