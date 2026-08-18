import * as yup from "yup";
import type { BusinessProfilePayload } from "../types/businessProfile.payload.type";
import { HEX_COLOR, VAT_REGEX } from "../constants/regex";
import {
  emptyMsg,
  ExccedFileSizeLimit,
  InvalidType,
  minLengthMsg,
  notSelectedMsg,
} from "../constants/messages";
import { BRAND_LOGO, BUSINESS_NAME } from "../constants/limits";
import { userProfileSchema } from "./userProfile.payload.schema";
import { ALLOWED_IMAGE_TYPES } from "../constants/types";

export const isColorHex = (colorCode: string) => {
  const isHex = HEX_COLOR.test(colorCode);
  if (isHex) {
    return true;
  }
  return "Invalid color code, please choose valid hex";
};

export const isValidVat = (vatNumber: string) => {
  if (VAT_REGEX.test(vatNumber)) {
    return true;
  }
  return "Enter valid vat number";
};

export const BusinessProfilePayloadSchema: yup.ObjectSchema<BusinessProfilePayload> =
  yup.object({
    brandLogo: yup
      .mixed<File>()
      .required(notSelectedMsg("Brand Logo"))
      .test((value, ctx) => {
        if (value.size / (1024 * 1024) > BRAND_LOGO.maxSize) {
          return ctx.createError({
            message: ExccedFileSizeLimit("Brand Logo", BRAND_LOGO.maxSize),
          });
        }

        if (!ALLOWED_IMAGE_TYPES.includes(value.type)) {
          return ctx.createError({ message: InvalidType(ALLOWED_IMAGE_TYPES) });
        }

        return true;
      }),
    brandColor: yup
      .string()
      .required(emptyMsg("Brand Color"))
      .test(async (value, ctx) => {
        const result = isColorHex(value);
        if (typeof result !== "string") {
          return true;
        }
        return ctx.createError({ message: result });
      }),

    businessName: yup
      .string()
      .required(emptyMsg("Business name"))
      .min(
        BUSINESS_NAME.minLength,
        minLengthMsg("Business name", BUSINESS_NAME.minLength),
      ),

    businessPhoneNo: userProfileSchema.fields
      .phoneNo as yup.StringSchema<string>,

    vatRegistered: yup.boolean().required(emptyMsg("Vat Registeration")),

    vatNumber: yup
      .string()
      .defined()
      .when("vatRegistered", {
        is: true,
        then: (schema) =>
          schema.test(async (value, context) => {
            const res = isValidVat(value);
            if (typeof res !== "string") {
              return true;
            }
            return context.createError({ message: res });
          }),
        otherwise: (schema) => schema.notRequired(),
      }),

    trade: yup.string().required(notSelectedMsg("Trade")),
  });
