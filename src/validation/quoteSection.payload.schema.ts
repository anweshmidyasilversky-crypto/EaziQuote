import { emptyMsg, notSelectedMsg } from "@/constants/messages";
import type {
  QuoteSectionCreatePayload,
  QuoteSectionUpdatePayload,
} from "@/types/api.requests.type";
import * as yup from "yup";

export const qouteSectionCreateSchema: yup.ObjectSchema<QuoteSectionCreatePayload> =
  yup.object({
    sort: yup.number().required(notSelectedMsg("sort")),
    title: yup.string().trim().required(emptyMsg("Section")),
    content: yup.string().trim().required(emptyMsg("content")),
  });

export const QuoteSectionUpdateSchema: yup.ObjectSchema<QuoteSectionUpdatePayload> =
  yup
    .object({
      id: yup.number().required(emptyMsg("Quote Id")),
    })
    .concat(qouteSectionCreateSchema);
