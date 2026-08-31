/**
 * Represents an item line within a specific quote.
 * Distinct from the catalog `Item` type — this carries quantity and a
 * pre-computed total so the UI doesn't need to recalculate on every render.
 *
 * Rule: total = pricePerUnit × quantity (enforced at creation / update time)
 */
export interface QuoteLineItem {
  /** Unique ID for this line within the quote (e.g. nanoid()) */
  id: string;
  /** Optional reference back to the catalog Item */
  itemId?: string;
  catId: string;
  subCatId: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  /** Cost/buy price (unitCost) — used for margin calculations */
  unitCost: number;
  quantity: number;
  /** Stored computed value: pricePerUnit × quantity */
  total: number;
}

/** Compute the total for a line item */
export const computeLineItemTotal = (
  pricePerUnit: number,
  quantity: number,
): number => pricePerUnit * quantity;
