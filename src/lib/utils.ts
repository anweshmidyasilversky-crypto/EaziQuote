import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { addressList, type AddressDetail } from "../constants/dummyData";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatOrdinalDate = (date: Date): string => {
  const day = date.getDate();

  // 1. Determine the mathematical ordinal suffix
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

  // 2. Extract the weekday and short month using 'en-GB'
  const weekday = date.toLocaleDateString("en-GB", { weekday: "long" }); // e.g., "Tuesday"
  const month = date.toLocaleDateString("en-GB", { month: "short" }); // e.g., "Oct"

  // 3. Assemble the pieces
  return `${weekday}, ${day}${suffix} ${month}`;
};

export function getFormattedTimeDiff(
  timestamp: string | number | Date,
): string {
  const targetDate = new Date(timestamp);
  const now = new Date();

  // Get absolute difference in seconds
  const diffInSecs = Math.floor(
    Math.abs(targetDate.getTime() - now.getTime()) / 1000,
  );

  // Time conversion constants
  const secsInDay = 86400;
  const secsInHour = 3600;
  const secsInMin = 60;

  // Check highest unit down to lowest
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
