import { deleteInvoice } from "@/api/services/invoices.api";
import { useMutation } from "@tanstack/react-query";

function useInvoiceMutations() {
  const invoiceDeleteMutation = useMutation({
    mutationKey: ["invoice_delete"],
    mutationFn: (invoiceId: string | number) => deleteInvoice(invoiceId),
  });
  return {
    invoiceDeleteMutation,
  };
}

export default useInvoiceMutations;
