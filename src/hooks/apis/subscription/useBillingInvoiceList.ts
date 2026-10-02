import { showErrorToast } from "@/api/axiosInstance";
import { getBillingInvoiceList } from "@/api/services/subscriptions.api";
import { useQuery } from "@tanstack/react-query";

export type useBillingInvoiceListProps = {
  start_after?: string;
};

function useBillingInvoiceList({ start_after }: useBillingInvoiceListProps) {
  const { data, error, isFetching } = useQuery({
    queryKey: ["billing_invoice", start_after],
    queryFn: () =>
      getBillingInvoiceList({
        starting_after: start_after,
      }),
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    invoiceList: data?.payload.items ?? [],
    isFetching,
    hasNextPage: data?.payload.next_page ? true : false,
  };
}

export default useBillingInvoiceList;
