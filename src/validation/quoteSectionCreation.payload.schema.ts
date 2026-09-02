import { emptyMsg, notSelectedMsg } from "@/constants/messages";
import type { QuoteSection } from "@/types/quoteSection.type";
import * as yup from "yup";

export const qouteSectionSchema: yup.ObjectSchema<QuoteSection> = yup.object({
  id: yup.string().trim().required(),
  order: yup.number().required(notSelectedMsg("Order")),
  section: yup.string().trim().required(emptyMsg("Section")),
  description: yup.string().trim().required(emptyMsg("Description")),
});
