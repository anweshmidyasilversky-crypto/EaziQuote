import { emptyMsg } from "@/constants/messages";
import type { InvoiceCreateApiPayload } from "@/types/api.requests.type";
import {
  DocumentCategories,
  QuoteTemplate,
  type ItemDetails,
} from "@/types/api.responses.type";
import * as yup from "yup";
import { attachmentsSchema } from "./quote.summary.schema";

export const createInvoiceSchema: yup.ObjectSchema<InvoiceCreateApiPayload> =
  yup.object({
    quote_id: yup.string().required(emptyMsg("Quote")),
    invoice_date: yup.string().trim().required(emptyMsg("Invoice Date")),
    due_date: yup.string().trim().required(emptyMsg("Due date")),
    message: yup.string().optional(),
    attachments: attachmentsSchema,
    notes: yup.string().optional(),
    template: yup.mixed<QuoteTemplate>().optional(),
    categorised: yup.mixed<DocumentCategories>().optional(),
    is_company_phone_number_show: yup.boolean().optional(),
  });

export const itemDetailsListSchema: yup.ObjectSchema<{ items: ItemDetails[] }> =
  yup.object({
    items: yup.array<ItemDetails>().required(emptyMsg("Item")),
  });
