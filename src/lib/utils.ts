import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  addressList,
  QuoteActivityStatus,
  type AddressDetail,
  type ClientDataWithFilters,
  type QuoteData,
} from "../constants/dummyData";
import { useAppSelector } from "../redux/store";
import type { Quote } from "../types/quote.type";
import type { Client } from "../types/client.type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Redux selector helpers ────────────────────────────────────────────────────
// NOTE: these are React hooks — only call them inside React function components.

export const useClientById = (clientId: string) => {
  return useAppSelector((state) =>
    state.clients.find((c) => c.id === clientId),
  );
};

export const useQuoteById = (quoteId: string) => {
  return useAppSelector((state) => state.quotes.find((q) => q.id === quoteId));
};

// ── Computed value helpers ────────────────────────────────────────────────────

/**
 * Derive the total amount for a quote by summing all line item totals.
 * Rule: item.total = item.pricePerUnit × item.quantity (stored on the item).
 */
export const getQuoteAmount = (quote: Quote): number =>
  quote.items?.reduce((sum, item) => sum + item.total, 0) || 0;

/**
 * Map a Redux `Quote` + client lookup to the `QuoteData` shape used by tables.
 * The `amount` field is computed from line items — never stored separately.
 */
export const quoteToDisplayData = (
  quote: Quote,
  clients: Client[],
): QuoteData => {
  const client = clients.find((c) => c.id === quote.clientId);
  return {
    id: quote.id,
    title: quote.title,
    quote: quote.referenceNumber,
    client: client?.name ?? "Unknown Client",
    companyName: client?.companyName,
    amount: getQuoteAmount(quote),
    // QuoteActivityStatus values match QuoteStatus — cast is safe
    status: quote.status as unknown as QuoteActivityStatus,
    creationDate: formatDisplayDate(quote.quoteDate),
    expiryDate: formatDisplayDate(quote.expiryDate),
    paymentMethod: quote.paymentMethod as "Cash" | "Online",
  };
};

/**
 * Map a Redux `Client` to the `ClientDataWithFilters` shape used by tables.
 * `activityCount` is computed as the number of quotes associated with this client.
 */
export const clientToDisplayData = (
  client: Client,
  quotes: Quote[],
): ClientDataWithFilters => ({
  id: client.id,
  client: client.name,
  company: client.companyName,
  phone: client.phone,
  email: client.email,
  createdAt: client.createdAt ?? new Date().toISOString(),
  activityCount: quotes.filter((q) => q.clientId === client.id).length,
});

// ── Date formatting helpers ───────────────────────────────────────────────────

/** Format a "YYYY-MM-DD" or ISO string to "DD Mon YYYY" for display */
export const formatDisplayDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr; // return as-is if unparseable
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
};

export const formatOrdinalDate = (date: Date): string => {
  const day = date.getDate();

  let suffix = "th";
  if (day < 11 || day > 13) {
    switch (day % 10) {
      case 1:
        suffix = "st";
        break;
      case 2:
        suffix = "nd";
        break;
      case 3:
        suffix = "rd";
        break;
    }
  }

  const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
  const month = date.toLocaleDateString("en-GB", { month: "short" });

  return `${weekday}, ${day}${suffix} ${month}`;
};

export function getFormattedTimeDiff(
  timestamp: string | number | Date,
): string {
  const targetDate = new Date(timestamp);
  const now = new Date();

  const diffInSecs = Math.floor(
    Math.abs(targetDate.getTime() - now.getTime()) / 1000,
  );

  const secsInDay = 86400;
  const secsInHour = 3600;
  const secsInMin = 60;

  if (diffInSecs >= secsInDay) {
    const days = Math.floor(diffInSecs / secsInDay);
    return `${days} day${days > 1 ? "s" : ""}`;
  }

  if (diffInSecs >= secsInHour) {
    const hours = Math.floor(diffInSecs / secsInHour);
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  if (diffInSecs >= secsInMin) {
    const minutes = Math.floor(diffInSecs / secsInMin);
    return `${minutes} min${minutes > 1 ? "s" : ""}`;
  }

  if (diffInSecs > 0) {
    return `${diffInSecs} sec${diffInSecs > 1 ? "s" : ""}`;
  }

  return "just now";
}

export function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

export function getAddress(postCode: string): AddressDetail | undefined {
  return addressList.find((address) => address.postCode === postCode);
}

export const getInitials = (fullName: string) => {
  const [fname, lname] = fullName.split(" ");
  return fname[0].toUpperCase() + (lname ? lname[0].toUpperCase() : "");
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

export const nextQuoteRefNo = () => {
  const quotes = useAppSelector((state) => state.quotes);
  let maxId = 1;
  const currYear = new Date().getFullYear().toString();
  quotes.forEach((quote) => {
    const [_, quoteYear, quoteNo] = quote.referenceNumber.split("-");
    if (currYear === quoteYear) {
      maxId = Math.max(maxId, Number(quoteNo) + 1);
    }
  });
  return `QT-${currYear}-${maxId}`;
};

export const getQuote = (refNo: string) => {
  const quotes = useAppSelector((state) => state.quotes);
  return quotes.find((quote) => quote.referenceNumber === refNo);
};

export const getClient = (clientId: string | undefined) => {
  const clients = useAppSelector((state) => state.clients);
  return clients.find((client) => client.id === clientId);
};

export const getCategory = (catId: string) => {
  const categories = useAppSelector((state) => state.categories);
  return categories.find((category) => category.id === catId);
};

export const getSubCategory = (subCatId: string) => {
  const subCategories = useAppSelector((state) => state.subCategories);
  return subCategories.find((subCategory) => subCategory.id === subCatId);
};
