import * as yup from "yup";
import { userSignInSchema } from "./user.signIn.payload.schema";
import {
  type ResetPassword,
  type UpdatePassword,
} from "../types/passwordResetUpdate.type";

export const resetPasswordSchema: yup.ObjectSchema<ResetPassword> = yup.object({
  newPassword: userSignInSchema.fields.password as yup.StringSchema<string>,
  confirmPassword: userSignInSchema.fields.password as yup.StringSchema<string>,
});

export const updatePasswordSchema = yup
  .object<UpdatePassword>({
    currPassword: userSignInSchema.fields.password as yup.StringSchema<string>,
  })
  .concat(resetPasswordSchema);
