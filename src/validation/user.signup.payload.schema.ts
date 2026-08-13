import * as yup from "yup";
import type { UserSignupPayload } from "../types/user.signup.payload.type";
import { userSignInSchema } from "./user.signIn.payload.schema";

export const UserSignupPayloadSchema: yup.ObjectSchema<UserSignupPayload> =
  yup.object({
    email: userSignInSchema.fields.email as yup.StringSchema<string>,
    password: userSignInSchema.fields.password as yup.StringSchema<string>,
    confirmPassword: yup
      .string()
      .required()
      .oneOf([yup.ref("password")], "Passwords must match"),
  });
