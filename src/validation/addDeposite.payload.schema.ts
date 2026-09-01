import * as yup from "yup";
import {
  PaymentMethods,
  type AddDepositePayload,
} from "../types/addDeposite.payload.type";
import { emptyMsg, invalidMsg, notSelectedMsg } from "../constants/messages";

export const amountSchema = yup
  .number()
  .typeError("Amount must be a valid number")
  .required(emptyMsg("Amount"))
  .moreThan(0, "Must be greater than 0");

export const paymentMethodSchema = yup
  .mixed<PaymentMethods>()
  .oneOf(Object.values(PaymentMethods), invalidMsg("Payment Method"))
  .required(notSelectedMsg("Payment Option"));

export const percentageSchema = yup
  .number()
  .typeError("Percentage must be valid")
  .required(emptyMsg("Percentage"))
  .moreThan(0, "Must be greater than 0")
  .max(100, "Can't exceed 100");
