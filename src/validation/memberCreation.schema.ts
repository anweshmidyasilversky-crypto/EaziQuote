import { emptyMsg } from "@/constants/messages";
import type { MemberCreationPayload } from "@/types/memberCreation.payload.type";
import * as yup from "yup";
import { emailSchema, userSignInSchema } from "./user.signIn.payload.schema";
export const memberCreationSchema: yup.ObjectSchema<MemberCreationPayload> =
  yup.object({
    name: yup
      .string()
      .trim()
      .required(emptyMsg("Name"))
      .min(1, "Name must be atleast length 1"),
    email: emailSchema.fields.email as yup.StringSchema<string>,
    password: userSignInSchema.fields.password as yup.StringSchema<string>,
  });
