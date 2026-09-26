import { getInvoicePreview } from "@/api/services/invoices.api";
import type { PageFilters } from "@/types/api.requests.type";
import { useQuery } from "@tanstack/react-query";

export type useInvoicePreviewProps = {
  invoice_id: string | number;
  hash: string;
  filters?: PageFilters;
  enabled?: boolean;
};

function useInvoicePreview({
  invoice_id,
  hash,
  filters,
  enabled,
}: useInvoicePreviewProps) {
  const { data, isFetching } = useQuery({
    queryKey: ["invoice_preview"],
    queryFn: () =>
      getInvoicePreview(
        {
          invoice_id,
          hash,
        },
        filters,
      ),
    enabled,
  });
  return {
    invoicePreviewHTml: data?.payload,
    isFetching,
  };
}

export default useInvoicePreview;
