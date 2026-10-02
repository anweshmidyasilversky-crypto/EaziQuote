import { emptyMsg, notSelectedMsg } from "@/constants/messages";
import type { BillingPreference } from "@/types/billingPreference.payload.type";
import * as yup from "yup";

export const billingPreferenceSchema: yup.ObjectSchema<BillingPreference> =
  yup.object({
    vatRate: yup.number().required(notSelectedMsg("Vat Rate")),
    quoteExpiry: yup
      .number()
      .required(emptyMsg("Quote Expiry"))
      .min(1, "Quote Expiry Should be atleast 1"),
    paymentTerms: yup
      .number()
      .required(emptyMsg("Payment Terms"))
      .min(1, `Payment Terms Should be atleast 1`),
  });
