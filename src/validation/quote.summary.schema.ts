import * as yup from "yup";
import type { QuoteSummary } from "../types/quoteCreation.payload.type";
import {
  emptyMsg,
  ExccedFileSizeLimit,
  InvalidType,
  maxLengthMsg,
  minLengthMsg,
  notSelectedMsg,
} from "../constants/messages";
import {
  ATTACHMENTS,
  JOB_DESCRIPTION,
  NOTES,
  QUOTE_TITLE,
} from "../constants/limits";
import { ALLOWED_ATTACHMENT_TYPES } from "../constants/types";

export const attachmentsSchema = yup
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
        console.log(file.type);
        console.log(ALLOWED_ATTACHMENT_TYPES);
        return this.createError({
          message: InvalidType(ALLOWED_ATTACHMENT_TYPES),
        });
      }
    }
    return true;
  });

export const quoteSummarySchema: yup.ObjectSchema<QuoteSummary> = yup.object({
  quoteTitle: yup
    .string()
    .trim()
    .required(emptyMsg("Quote title"))
    .min(
      QUOTE_TITLE.minLength,
      minLengthMsg("Quote title", QUOTE_TITLE.minLength),
    )
    .max(
      QUOTE_TITLE.maxLength,
      maxLengthMsg("Quote title", QUOTE_TITLE.maxLength),
    ),
  referenceNumber: yup
    .string()
    .trim()
    .required(emptyMsg("Quote title"))
    .min(1, minLengthMsg("Quote title", 1)),
  quoteDate: yup.string().trim().required(emptyMsg("Quote Date")),
  expiryDate: yup.string().trim().required(emptyMsg("Expiry Date")),
  hidePhoneNumber: yup.bool().required(),
  clientId: yup.string().trim().required(notSelectedMsg("Client")),
  jobDescription: yup
    .string()
    .trim()
    .required(emptyMsg("Job description"))
    .max(
      JOB_DESCRIPTION.maxLength,
      maxLengthMsg("Job description", JOB_DESCRIPTION.maxLength),
    ),
  notes: yup
    .string()
    .trim()
    .optional()
    .max(NOTES.maxLength, maxLengthMsg("Notes", NOTES.maxLength)),
  attachments: attachmentsSchema,
});
