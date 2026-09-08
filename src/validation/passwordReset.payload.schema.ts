import type { PasswordResetPayload } from "@/types/passwordReset.payload.type";
import * as yup from "yup";
import { userSignInSchema } from "./user.signIn.payload.schema";

export const passwordResetSchema: yup.ObjectSchema<PasswordResetPayload> =
  yup.object({
    oldPassword: userSignInSchema.fields.password as yup.StringSchema<string>,
    newPassword: userSignInSchema.fields.password as yup.StringSchema<string>,
    confirmPassword: yup
      .string()
      .required()
      .oneOf([yup.ref("newPassword")], "Passwords must match"),
  });
