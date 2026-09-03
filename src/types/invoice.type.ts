export type InvoiceStatus =
  | "Paid"
  | "Pending"
  | "Overdue"
  | "Draft"
  | "Cancelled";

export interface Invoice {
  id: string;
  itemName: string;
  category: string;
  subcategory: string;
  quantity: string;
  pricePerUnit: number;
  unitCost: number;
  total: number;
  status: InvoiceStatus;
  date?: string;
}
