import * as yup from "yup";
import type { UserProfilePayload } from "../types/userProfile.payload.type";
import {
  emptyMsg,
  ExccedFileSizeLimit,
  invalidMsg,
  InvalidType,
  minLengthMsg,
  notSelectedMsg,
} from "../constants/messages";
import { FULL_NAME, PROFILE_PIC } from "../constants/limits";
import { PHONE_NO_REGEX } from "../constants/regex";
import { ALLOWED_IMAGE_TYPES } from "../constants/types";

export const phoneNoValidation = (phoneNo: string) => {
  if (PHONE_NO_REGEX.test(phoneNo)) {
    return true;
  }
  return invalidMsg("phone number");
};

export const userProfileSchema: yup.ObjectSchema<UserProfilePayload> =
  yup.object({
    profilePic: yup
      .mixed<File>()
      .required(notSelectedMsg("Profile Picture"))
      .test((value, ctx) => {
        if (value.size / (1024 * 1024) > PROFILE_PIC.maxsize) {
          return ctx.createError({
            message: ExccedFileSizeLimit(
              "Profile picture",
              PROFILE_PIC.maxsize,
            ),
          });
        }

        if (!ALLOWED_IMAGE_TYPES.includes(value.type)) {
          return ctx.createError({ message: InvalidType(ALLOWED_IMAGE_TYPES) });
        }

        return true;
      }),
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
