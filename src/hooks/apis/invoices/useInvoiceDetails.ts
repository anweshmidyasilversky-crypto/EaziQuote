import { showErrorToast } from "@/api/axiosInstance";
import { getInvoiceDetails } from "@/api/services/invoices.api";
import { useQuery } from "@tanstack/react-query";

export type useInvoiceDetailsProps = {
  id: string | number;
  enabled?: boolean;
  refetchOnFocus?: boolean;
};

function useInvoiceDetails({
  id,
  enabled = true,
  refetchOnFocus = true,
}: useInvoiceDetailsProps) {
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["invoice_details"],
    queryFn: () => getInvoiceDetails(id),
    enabled,
    refetchOnWindowFocus: refetchOnFocus,
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    invoiceDetails: data?.payload,
    isFetching,
    refetch,
  };
}

export default useInvoiceDetails;
