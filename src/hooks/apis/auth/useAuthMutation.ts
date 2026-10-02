import {
  logout,
  updateBillingDetails,
  updateBillingPreference,
  updateQuoteInvoiceSettings,
} from "@/api/services/auth.api";
import { deleteUser } from "@/api/services/user.api";
import type {
  BillingDetailsApiPayload,
  BillingPreferenceApiPayload,
  QuoteInvoiceSettingsApiPayload,
} from "@/types/api.requests.type";
import { useMutation } from "@tanstack/react-query";

function useAuthMutation() {
  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
  });

  const userDeleteMutation = useMutation({
    mutationKey: ["delete_user"],
    mutationFn: deleteUser,
  });

  const billingDetailsMutation = useMutation({
    mutationFn: (payload: BillingDetailsApiPayload) =>
      updateBillingDetails(payload),
  });

  const billingPreferenceMutation = useMutation({
    mutationFn: (payload: BillingPreferenceApiPayload) =>
      updateBillingPreference(payload),
  });

  const quoteInvoiceSettingsMutation = useMutation({
    mutationFn: (payload: QuoteInvoiceSettingsApiPayload) => {
      return updateQuoteInvoiceSettings(payload);
    },
  });

  return {
    logoutMutation,
    userDeleteMutation,
    billingDetailsMutation,
    billingPreferenceMutation,
    quoteInvoiceSettingsMutation,
  };
}

export default useAuthMutation;
