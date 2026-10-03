import {
  login,
  logout,
  sendPasswordResetLink,
  signup,
  updateBillingDetails,
  updateBillingPreference,
  updateQuoteInvoiceSettings,
} from "@/api/services/auth.api";
import { deleteUser } from "@/api/services/user.api";
import type {
  BillingDetailsApiPayload,
  BillingPreferenceApiPayload,
  PasswordResetLinkPayload,
  QuoteInvoiceSettingsApiPayload,
  SignupPayload,
} from "@/types/api.requests.type";
import { useMutation } from "@tanstack/react-query";

function useAuthMutation() {
  const signupMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: (payload: SignupPayload) => signup(payload),
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (payload: SignupPayload) => login(payload),
  });

  const passwordResetMutation = useMutation({
    mutationKey: ["password_reset"],
    mutationFn: (payload: PasswordResetLinkPayload) =>
      sendPasswordResetLink(payload),
  });

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
    signupMutation,
    loginMutation,
    logoutMutation,
    userDeleteMutation,
    passwordResetMutation,
    billingDetailsMutation,
    billingPreferenceMutation,
    quoteInvoiceSettingsMutation,
  };
}

export default useAuthMutation;
