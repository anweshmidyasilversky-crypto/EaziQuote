import * as yup from "yup";
import { emptyMsg } from "../constants/messages";
import type { BusinessAddressPayload } from "../types/businessAddress.payload.type";
export const businessAddressSchema: yup.ObjectSchema<BusinessAddressPayload> =
  yup.object({
    street: yup.string().trim().required(emptyMsg("Street")),
    city: yup.string().trim().required(emptyMsg("City")),
    postCode: yup.string().trim().required(emptyMsg("Postcode")),
    country: yup.string().trim().required(emptyMsg("Country")),
  });
