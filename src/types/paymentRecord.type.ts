export enum PaymentMethods {
  cash = "cash",
  strip = "strip",
  deposit = "deposit",
}

export enum AmountTypes {
  invoice = "invoice",
  deposit = "deposit",
}

export enum PaymentStatus {
  failed = "failed",
  received = "received",
  pending = "pending",
}

export type paymentRecord = {
  id: number;
  payment_method: PaymentMethods;
  amount_type: AmountTypes;
  status: PaymentStatus;
  amount: number;
  amount_formatted: string;
  allocated: string;
  credit: string;
  currency: string;
  payment_date: string;
  stripe_payment_link_url: string | null;
  client_name: string;
  client_email: string;
  payment_link_url: string | null;
};
