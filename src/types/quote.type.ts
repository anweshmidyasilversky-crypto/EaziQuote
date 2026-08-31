import type { QuoteLineItem } from "./quoteLineItem.type";
import type { QuoteSection } from "./quoteSection.type";

export type QuoteStatus =
  | "Draft"
  | "Sent"
  | "Accepted"
  | "Rejected"
  | "Expired"
  | "Cancelled";

export type QuotePaymentMethod = "Cash" | "Online";

export type QuoteAttachment = File

export interface Quote {
  id: string;
  title: string;
  referenceNumber: string;
  quoteDate: string;
  expiryDate: string;
  hidePhoneNumber: boolean;
  clientId: string;
  jobDescription: string;
  notes: string;
  attachments: QuoteAttachment[];
  hasCompletedSummary: boolean;

  /** Quote workflow status */
  status: QuoteStatus;

  /** Payment method chosen for this quote */
  paymentMethod: QuotePaymentMethod;

  /**
   * Line items belonging to this quote.
   * The quote's total amount is derived as:
   *   items.reduce((sum, item) => sum + item.total, 0)
   */
  items: QuoteLineItem[];

  isItemsSelected?: boolean;
  sections?: QuoteSection[];
}

