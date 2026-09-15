import type { PaymentMethods } from "./api.responses.type";

export interface AddDepositePayload {
  deposite: number;
  paymentMethod: PaymentMethods;
}
