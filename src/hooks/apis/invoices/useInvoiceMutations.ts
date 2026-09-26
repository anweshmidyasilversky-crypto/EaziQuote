import {
  createInvoice,
  deleteInvoice,
  updateInvoice,
  updateInvoiceStatus,
  sendInvoiceEmail,
} from "@/api/services/invoices.api";
import type {
  InvoiceCreateApiPayload,
  InvoiceUpdateApiPayload,
} from "@/types/api.requests.type";
import type { InvoiceStatus } from "@/types/api.responses.type";
import { useMutation } from "@tanstack/react-query";

function useInvoiceMutations() {
  const invoiceDeleteMutation = useMutation({
    mutationKey: ["invoice_delete"],
    mutationFn: (invoiceId: string | number) => deleteInvoice(invoiceId),
  });

  const invoiceCreateMutation = useMutation({
    mutationKey: ["invoice_create"],
    mutationFn: (payload: InvoiceCreateApiPayload) => createInvoice(payload),
  });

  const invoiceUpdateMutation = useMutation({
    mutationKey: ["invoice_update"],
    mutationFn: (
      payload: InvoiceUpdateApiPayload & {
        invoice_id: string | number;
      },
    ) => updateInvoice(payload),
  });

  const invoiceStatusMutation = useMutation({
    mutationKey: ["invoice_status_update"],
    mutationFn: (payload: {
      status: InvoiceStatus;
      invoice_id: string | number;
    }) => updateInvoiceStatus(payload),
  });

  const sendInvoiceEmailMutation = useMutation({
    mutationKey: ["invoice_email_send"],
    mutationFn: (invoice_id: string | number) => sendInvoiceEmail(invoice_id),
  });

  return {
    invoiceCreateMutation,
    invoiceUpdateMutation,
    invoiceStatusMutation,
    sendInvoiceEmailMutation,
    invoiceDeleteMutation,
  };
}

export default useInvoiceMutations;
