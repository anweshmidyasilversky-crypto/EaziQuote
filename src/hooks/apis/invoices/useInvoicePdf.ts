import { generateInvoicePdf } from "@/api/services/invoices.api";
import type { PageFilters } from "@/types/api.requests.type";
import { useQuery } from "@tanstack/react-query";

export type useInvoicePdfProps = {
  invoice_id: string | number;
  filters?: PageFilters;
  enabled?: boolean;
};

function useInvoicePdf({ invoice_id, filters, enabled }: useInvoicePdfProps) {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["invoice_pdf"],
    queryFn: () => generateInvoicePdf(invoice_id, filters),
    enabled,
  });
  return {
    invoicePdf: data,
    isFetching,
    refetch,
  };
}

export default useInvoicePdf;
