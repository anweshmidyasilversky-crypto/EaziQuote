import { getInvoiceBillDownload } from "@/api/services/subscriptions.api";
import { useMutation } from "@tanstack/react-query";

function useSubscriptionMutations() {
  const downloadInvoiceMutation = useMutation({
    mutationFn: (invoice_url: string) => getInvoiceBillDownload(invoice_url),
  });
  return {
    downloadInvoiceMutation,
  };
}

export default useSubscriptionMutations;
