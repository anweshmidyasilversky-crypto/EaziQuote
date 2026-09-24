import {
  createPayment,
  deletePayment,
  sendPaymentLink,
} from "@/api/services/payments.api";
import type {
  CreatePaymentDeposit,
  CreatePaymentInvoice,
} from "@/types/api.requests.type";
import { useMutation } from "@tanstack/react-query";

function usePaymentMutations() {
  const paymentDeleteMutation = useMutation({
    mutationKey: ["payment_delete"],
    mutationFn: (payment_id: string | number) => deletePayment(payment_id),
  });

  const createPaymentMutation = useMutation({
    mutationKey: ["payment_create"],
    mutationFn: (payload: CreatePaymentDeposit | CreatePaymentInvoice) =>
      createPayment(payload),
  });

  const paymentLinkShareMutation = useMutation({
    mutationKey: ["payment_mail"],
    mutationFn: (paymentId: string | number) => sendPaymentLink(paymentId),
  });

  return {
    createPaymentMutation,
    paymentDeleteMutation,
    paymentLinkShareMutation,
  };
}

export default usePaymentMutations;
