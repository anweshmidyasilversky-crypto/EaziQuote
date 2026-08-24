import * as yup from "yup";
import type { ClientEditPayload } from "../types/clientEdit.payload.type";
import { clientCreationSchema } from "./clientCreation.payload.schema";
import { businessAddressSchema } from "./businessAddress.payload.schema";
import type { BusinessAddressPayload } from "../types/businessAddress.payload.type";
import { emptyMsg } from "../constants/messages";
export const clientEditPayloadSchema: yup.ObjectSchema<ClientEditPayload> = yup
  .object({
    address: yup.string().trim().required(emptyMsg("Address")),
  })
  .concat(
    clientCreationSchema.omit(
      Object.keys(
        businessAddressSchema.fields,
      ) as (keyof BusinessAddressPayload)[],
    ),
  );
