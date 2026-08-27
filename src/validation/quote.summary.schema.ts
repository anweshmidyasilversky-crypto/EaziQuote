import * as yup from "yup";
import type { QuoteSummary } from "../types/quoteCreation.payload.type";
import {
  emptyMsg,
  ExccedFileSizeLimit,
  InvalidType,
  minLengthMsg,
  notSelectedMsg,
} from "../constants/messages";
import { ATTACHMENTS } from "../constants/limits";
import { ALLOWED_ATTACHMENT_TYPES } from "../constants/types";
export const quoteSummarySchema: yup.ObjectSchema<QuoteSummary> = yup.object({
  quoteTitle: yup
    .string()
    .trim()
    .required(emptyMsg("Quote title"))
    .min(1, minLengthMsg("Quote title", 1)),
  referenceNumber: yup
    .string()
    .trim()
    .required(emptyMsg("Quote title"))
    .min(1, minLengthMsg("Quote title", 1)),
  quoteDate: yup.string().trim().required(emptyMsg("Quote Date")),
  expiryDate: yup.string().trim().required(emptyMsg("Expiry Date")),
  hidePhoneNumber: yup.bool().required(),
  clientId: yup.string().trim().required(notSelectedMsg("Client")),
  jobDescription: yup.string().trim().required(emptyMsg("Job description")),
  notes: yup.string().trim().optional(),
  attachments: yup
    .array()
    .of(yup.mixed<File>().required())
    .optional()
    .defined()
    .test("attachments", function (attachments) {
      if (!attachments?.length) return true;

      for (const file of attachments) {
        if (file.size / (1024 * 1024) > ATTACHMENTS.maxsize) {
          return this.createError({
            message: ExccedFileSizeLimit("Attachment", ATTACHMENTS.maxsize),
          });
        }

        if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
          return this.createError({
            message: InvalidType(ALLOWED_ATTACHMENT_TYPES),
          });
        }
      }

      return true;
    }),
});
