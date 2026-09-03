import { CARD_CVC_CODE, CARD_NUMBER } from "@/constants/limits";
import {
  emptyMsg,
  maxLengthMsg,
  minLengthMsg,
  notSelectedMsg,
} from "@/constants/messages";
import { CARD_EXPIRY_REGEX } from "@/constants/regex";
import type { Card } from "@/types/cardDetails.payload.type";
import * as yup from "yup";

export const cardSchema: yup.ObjectSchema<Card> = yup.object({
  cardNumber: yup
    .string()
    .trim()
    .required(emptyMsg("Card number"))
    .min(
      CARD_NUMBER.minLength,
      minLengthMsg("Card number", CARD_NUMBER.minLength),
    )
    .max(
      CARD_NUMBER.maxLength,
      maxLengthMsg("Card number", CARD_NUMBER.maxLength),
    ),

  expiryDate: yup
    .string()
    .trim()
    .required(emptyMsg("Expiry date"))
    .test((value, ctx) => {
      const isValid = CARD_EXPIRY_REGEX.test(value);
      if (!isValid) {
        return ctx.createError({
          message: "Expiry date should be as: MM/YY. e.g.: 08/29",
        });
      }
      return true;
    }),

  cvc: yup
    .string()
    .trim()
    .required(emptyMsg("CVC code"))
    .min(
      CARD_CVC_CODE.minLength,
      minLengthMsg("CVC code", CARD_CVC_CODE.minLength),
    )
    .max(
      CARD_CVC_CODE.maxLength,
      maxLengthMsg("CVC code", CARD_CVC_CODE.maxLength),
    ),

  country: yup.string().trim().required(notSelectedMsg("Country")),

  state: yup.string().trim().required(notSelectedMsg("State")),
});
