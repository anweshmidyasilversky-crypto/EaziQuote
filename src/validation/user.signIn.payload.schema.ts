import * as yup from "yup";
import type { UserSignInPayload } from "../types/user.signIn.payload.type";
import { PASSWORD } from "../constants/limits";
import {
  emptyMsg,
  invalidMsg,
  maxLengthMsg,
  minLengthMsg,
} from "../constants/messages";

export const valdiatePassword = (password: string) => {
  if (password.length < PASSWORD.minLength) {
    return minLengthMsg("password", PASSWORD.minLength);
  } else if (password.length > PASSWORD.maxLength) {
    return maxLengthMsg("password", PASSWORD.maxLength);
  }
  return true;
};

export const emailSchema = yup.object({
  email: yup.string().required(emptyMsg("Email")).email(invalidMsg("Email")),
});

export const userSignInSchema: yup.ObjectSchema<UserSignInPayload> = yup.object(
  {
    email: emailSchema.fields.email as yup.StringSchema<string>,

    password: yup
      .string()
      .trim()
      .required(emptyMsg("Password"))
      .min(PASSWORD.minLength, minLengthMsg("Password", PASSWORD.minLength))
      .max(PASSWORD.maxLength, maxLengthMsg("Password", PASSWORD.maxLength))
      .test(async (value, context) => {
        const result = valdiatePassword(value);
        return typeof result === "string"
          ? context.createError({ message: result })
          : result;
      }),
  },
);
