export enum PaymentMethods {
  cash = "Cash",
  stripe = "Stripe",
}

export interface AddDepositePayload {
  deposite: number;
  paymentMethod: PaymentMethods;
}
