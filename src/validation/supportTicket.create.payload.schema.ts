import { emptyMsg, notSelectedMsg } from "@/constants/messages";
import type { SupportTicketCreatePayload } from "@/types/api.requests.type";
import * as yup from "yup";

export const supportTicketCreateSchema: yup.ObjectSchema<SupportTicketCreatePayload> =
  yup.object({
    support_ticket_area_id: yup
      .number()
      .required(notSelectedMsg("Support ticket area")),
    other_area: yup.string().optional(),
    description: yup.string().trim().required(emptyMsg("Description")),
  });
