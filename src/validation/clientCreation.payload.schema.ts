import * as yup from "yup";
import { businessAddressSchema } from "./businessAddress.payload.schema";
import type { ClientCreationPayload } from "../types/clientCreation.payload.type";
import { emptyMsg, invalidMsg, minLengthMsg } from "../constants/messages";
import { FULL_NAME } from "../constants/limits";
import { userProfileSchema } from "./userProfile.payload.schema";

export const clientCreationSchema: yup.ObjectSchema<ClientCreationPayload> = yup
  .object({
    name: yup
      .string()
      .required(emptyMsg("Client name"))
      .min(
        FULL_NAME.minLength,
        minLengthMsg("Client name", FULL_NAME.minLength),
      ),
    companyName: yup
      .string()
      .required(emptyMsg("Company name"))
      .min(
        FULL_NAME.minLength,
        minLengthMsg("Company name", FULL_NAME.minLength),
      ),
    phone: userProfileSchema.fields.phoneNo as yup.StringSchema<string>,
    email: yup.string().required(emptyMsg("Email")).email(invalidMsg("Email")),
    createdAt: yup.string().optional(),
  })
  .concat(businessAddressSchema);
