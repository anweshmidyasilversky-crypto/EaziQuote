import { emptyMsg } from "@/constants/messages";
import type {
  CreatePresetQuote,
  PresetQuoteMutationItems,
} from "@/types/api.requests.type";
import * as yup from "yup";

export const presetQuoteMutationSchema: yup.ObjectSchema<CreatePresetQuote> =
  yup.object({
    name: yup.string().trim().required(emptyMsg("name")),
    description: yup.string().trim().optional(),
    quote_description: yup.string().trim().optional(),
    items: yup.array<PresetQuoteMutationItems>().optional(),
  });
