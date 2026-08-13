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
  }
  const hasSpecial = /[^a-zA-Z0-9 ]/.test(password);
  const alphaNumeric = /[^a-zA-Z0-9 ]/.test(password);

  if (!(hasSpecial && alphaNumeric)) {
    return `Should've alphabet & special character`;
  }

  return true;
};

export const userSignInSchema: yup.ObjectSchema<UserSignInPayload> = yup.object(
  {
    email: yup.string().required(emptyMsg("Email")).email(invalidMsg("Email")),

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
