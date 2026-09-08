import { PAYMENT_TERMS, QUOTE_EXPIRY } from "@/constants/limits";
import { emptyMsg, minLengthMsg, notSelectedMsg } from "@/constants/messages";
import type { BillingPreference } from "@/types/billingPreference.payload.type";
import * as yup from "yup";

export const billingPreferenceSchema: yup.ObjectSchema<BillingPreference> =
  yup.object({
    vatRate: yup.number().required(notSelectedMsg("Vat Rate")),
    quoteExpiry: yup
      .number()
      .required(emptyMsg("Quote Expiry"))
      .min(
        QUOTE_EXPIRY.minLength,
        minLengthMsg("Quote Expiry", QUOTE_EXPIRY.minLength),
      ),
    paymentTerms: yup
      .number()
      .required(emptyMsg("Payment Terms"))
      .min(
        PAYMENT_TERMS.minLength,
        minLengthMsg("Payment Terms", PAYMENT_TERMS.minLength),
      ),
  });
