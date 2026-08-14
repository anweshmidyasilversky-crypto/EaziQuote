import * as yup from "yup";
import type { UserProfilePayload } from "../types/userProfile.payload.type";
import { emptyMsg, invalidMsg, minLengthMsg } from "../constants/messages";
import { FULL_NAME } from "../constants/limits";
import { PHONE_NO_REGEX } from "../constants/regex";

export const phoneNoValidation = (phoneNo: string) => {
  if (PHONE_NO_REGEX.test(phoneNo)) {
    return true;
  }
  return invalidMsg("phone number");
};

export const userProfileSchema: yup.ObjectSchema<UserProfilePayload> =
  yup.object({
    name: yup
      .string()
      .trim()
      .required(emptyMsg("Name"))
      .min(FULL_NAME.minLength, minLengthMsg("Name", FULL_NAME.minLength)),

    phoneNo: yup
      .string()
      .required(emptyMsg("Phone Number"))
      .test(async (value, context) => {
        const result = phoneNoValidation(value);
        return typeof result === "string"
          ? context.createError({ message: result })
          : result;
      }),
  });
