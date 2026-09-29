import { showErrorToast } from "@/api/axiosInstance";
import { downloadPdf } from "@/api/services/quotes.api";
import { useQuery } from "@tanstack/react-query";

export type useQuoteDownloadProps = {
  quote_id: string | number;
  enabled: boolean;
};
function useQuoteDownload({ quote_id, enabled }: useQuoteDownloadProps) {
  const { data, isFetching, error } = useQuery({
    queryKey: ["quote_download", quote_id],
    queryFn: () => downloadPdf(quote_id),
    enabled,
  });

  if (error) {
    showErrorToast(error);
  }
  return {
    data,
    isFetching,
  };
}

export default useQuoteDownload;
