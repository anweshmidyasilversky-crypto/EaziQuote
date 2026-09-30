import * as yup from "yup";
import { emptyMsg } from "@/constants/messages";
import { emailSchema, userSignInSchema } from "./user.signIn.payload.schema";

export type MemberFormValues = {
  name: string;
  email: string;
  password?: string | null;
};

export const memberCreationSchema: yup.ObjectSchema<MemberFormValues> =
  yup.object({
    name: yup
      .string()
      .trim()
      .required(emptyMsg("Name"))
      .min(1, "Name must be atleast length 1"),

    email: emailSchema.fields.email as yup.StringSchema<string>,

    password: userSignInSchema.fields.password as yup.StringSchema<string>,
  });

export const memberUpdateSchema: yup.ObjectSchema<MemberFormValues> =
  yup.object({
    name: yup
      .string()
      .trim()
      .required(emptyMsg("Name"))
      .min(1, "Name must be atleast length 1"),

    email: emailSchema.fields.email as yup.StringSchema<string>,

    password: yup
      .string()
      .transform((value) => (value === "" ? undefined : value))
      .notRequired(),
  });
