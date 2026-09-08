import { SIGNATURE } from "@/constants/limits";
import { emptyMsg } from "@/constants/messages";
import type { QuoteSettings } from "@/types/quoteSettings.payload.type";
import * as yup from "yup";

export const quoteSettingsSchema: yup.ObjectSchema<QuoteSettings> = yup.object({
  terms: yup.string().trim().required(emptyMsg("Terms & Condition")),
  footerMsg: yup.string().trim().required(emptyMsg("Footer Message")),
  signatureBlob: yup
    .mixed<Blob>()
    .required(emptyMsg("Signature"))
    .test((value, ctx) => {
      if (!(value instanceof Blob)) {
        return ctx.createError({
          message: `Please attach file of correct format`,
        });
      }
      if (value.size / (1024 * 1024) > SIGNATURE.maxSize) {
        return ctx.createError({
          message: `Signature can't exceed ${SIGNATURE.maxSize} Mb`,
        });
      }
      return true;
    }),
});
