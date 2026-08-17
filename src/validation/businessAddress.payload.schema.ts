import * as yup from "yup";
import { emptyMsg } from "../constants/messages";
import type { BusinessAddressPayload } from "../types/businessAddress.payload.type";
export const businessAddressSchema: yup.ObjectSchema<BusinessAddressPayload> =
  yup.object({
    street: yup.string().required(emptyMsg("Street")).trim(),
    city: yup.string().required(emptyMsg("City")).trim(),
    postCode: yup.string().required(emptyMsg("Postcode")).trim(),
    country: yup.string().required(emptyMsg("Country")).trim(),
  });
