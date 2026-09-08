import {
  ACCOUNT_NAME,
  ACCOUNT_NUMBER,
  BANK_NAME,
  PAYMENT_LINK,
  SORT_CODE,
} from "@/constants/limits";
import { emptyMsg, maxLengthMsg, minLengthMsg } from "@/constants/messages";
import type { BankInfo } from "@/types/bankInfo.payload";
import * as yup from "yup";

export const bankInfoSchema: yup.ObjectSchema<BankInfo> = yup.object({
  paymentLink: yup
    .string()
    .trim()
    .required(emptyMsg("Payment Link"))
    .min(
      PAYMENT_LINK.minLength,
      minLengthMsg("Payment Link", PAYMENT_LINK.minLength),
    )
    .max(
      PAYMENT_LINK.maxLength,
      maxLengthMsg("Payment Link", PAYMENT_LINK.maxLength),
    ),

  bankName: yup
    .string()
    .trim()
    .required(emptyMsg("Bank Name"))
    .min(BANK_NAME.minLength, minLengthMsg("Bank Name", BANK_NAME.minLength))
    .max(BANK_NAME.maxLength, maxLengthMsg("Bank Name", BANK_NAME.maxLength)),

  accName: yup
    .string()
    .trim()
    .required(emptyMsg("Account Name"))
    .min(
      ACCOUNT_NAME.minLength,
      minLengthMsg("Account Name", ACCOUNT_NAME.minLength),
    )
    .max(
      ACCOUNT_NAME.maxLength,
      maxLengthMsg("Account Name", ACCOUNT_NAME.maxLength),
    ),

  accNumber: yup
    .string()
    .trim()
    .required(emptyMsg("Account Number"))
    .min(
      ACCOUNT_NUMBER.minLength,
      minLengthMsg("Account Number", ACCOUNT_NUMBER.minLength),
    )
    .max(
      ACCOUNT_NUMBER.maxLength,
      maxLengthMsg("Account Number", ACCOUNT_NUMBER.maxLength),
    ),

  sortCode: yup
    .string()
    .trim()
    .required(emptyMsg("Sort Code"))
    .min(SORT_CODE.minLength, minLengthMsg("Sort Code", SORT_CODE.minLength))
    .max(SORT_CODE.maxLength, maxLengthMsg("Sort Code", SORT_CODE.maxLength)),
});
