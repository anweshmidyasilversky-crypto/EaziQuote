import { showErrorToast } from "@/api/axiosInstance";
import { getInvoiceDetails } from "@/api/services/invoices.api";
import { useQuery } from "@tanstack/react-query";

export type useInvoiceDetailsProps = {
  id: string | number;
};

function useInvoiceDetails({ id }: useInvoiceDetailsProps) {
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["invoice_details"],
    queryFn: () => getInvoiceDetails(id),
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
