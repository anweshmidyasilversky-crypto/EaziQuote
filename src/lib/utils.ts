import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAppSelector } from "../redux/store";
import type { Quote } from "../types/quote.type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Computed value helpers ────────────────────────────────────────────────────

/**
 * Derive the total amount for a quote by summing all line item totals.
 * Rule: item.total = item.pricePerUnit × item.quantity (stored on the item).
 */
export const getQuoteAmount = (quote: Quote): number =>
  quote.items?.reduce((sum, item) => sum + item.total, 0) || 0;

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

export const getInitials = (fullName: string) => {
  if (!fullName) {
    return "user";
  }
  const [fname, lname] = fullName.split(" ");
  return fname[0].toUpperCase() + (lname ? lname[0].toUpperCase() : "");
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

export const getSubCategory = (subCatId: string) => {
  const subCategories = useAppSelector((state) => state.subCategories);
  return subCategories.find((subCategory) => subCategory.id === subCatId);
};

/**
 * Generates a random integer between a lower bound (lb) and an upper bound (ub) inclusive.
 */
export function getRandomNumber(lb: number, ub: number): number {
  return Math.floor(Math.random() * (ub - lb + 1)) + lb;
}

export function ObjToFormData<T extends Object>(data: T) {
  const formData = new FormData();
  Object.keys(data).forEach((objKey) => {
    const key = objKey as keyof T;
    if (data[key] instanceof File) {
      formData.append(
        key as string,
        new Blob([data[key]], { type: data[key].type }),
      );
    } else if (Array.isArray(data[key])) {
      data[key].forEach((val) => {
        formData.append(`${String(key)}[]`, val);
      });
    } else if (objKey === "deposit_required") {
      formData.append("deposit_required", data[key] ? "1" : "0");
    } else {
      if (["phone", "phone_number"].includes(objKey)) {
        formData.append(key as string, data[key] ? `+44${data[key]}` : "");
      } else {
        formData.append(key as string, (data[key] ?? "") as string);
      }
    }
  });
  console.log([...formData.entries()]);
  return formData;
}

export const dateToDdMonYyyy = (dateString: string) => {
  const date = new Date(dateString);
  const formatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

  return formatted;
};
