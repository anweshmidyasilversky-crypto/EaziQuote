import { emptyMsg, minLengthMsg, notSelectedMsg } from "@/constants/messages";
import type {
  CreatePaymentBase,
  CreatePaymentDeposit,
  CreatePaymentInvoice,
} from "@/types/api.requests.type";
import { PaymentAmountType, PaymentMethods } from "@/types/api.responses.type";
import * as yup from "yup";

export const paymentSchemaBase: yup.ObjectSchema<
  Omit<CreatePaymentBase, "amount" | "amount_type">
> = yup.object({
  payment_method: yup
    .mixed<PaymentMethods>()
    .required(notSelectedMsg("Payment Method")),
  payment_date: yup.string().required(notSelectedMsg("Date")),
});

const amountSchema = yup
  .number()
  .required(emptyMsg("Amount"))
  .min(1, minLengthMsg("Amount", 1));

const amountTypeSchema = yup
  .mixed<PaymentAmountType>()
  .required(notSelectedMsg("Amount Type"));

export const paymentDepositSchema: yup.ObjectSchema<CreatePaymentDeposit> = yup
  .object({
    client_id: yup.string().trim().required(notSelectedMsg("Client")),
    quote_id: yup.string().trim().required(notSelectedMsg("Quote")),
    amount: amountSchema,
    amount_type: amountTypeSchema,
  })
  .concat(paymentSchemaBase);

export const paymentInvoiceSchema: yup.ObjectSchema<CreatePaymentInvoice> = yup
  .object({
    invoice_id: yup.string().trim().required(notSelectedMsg("Invoice")),
    amount: amountSchema,
    amount_type: amountTypeSchema,
  })
  .concat(paymentSchemaBase);
