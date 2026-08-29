import type { Item } from "./item.type";
import type { QuoteSection } from "./quoteSection.type";

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
  attachments: File[];
  hasCompletedSummary: boolean;

  items: Item[];
  isItemsSelected?: boolean;
  sections?: QuoteSection[];
}
