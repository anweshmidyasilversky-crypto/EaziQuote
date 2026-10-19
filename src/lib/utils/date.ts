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

export function previewDateFormatter(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Parts returns an array of objects ({ type: 'day', value: '16' }, etc.)
  const parts = formatter.formatToParts(date);
  const day = parts?.find((p) => p.type === "day")?.value;
  const month = parts?.find((p) => p.type === "month")?.value;
  const year = parts?.find((p) => p.type === "year")?.value;

  return `${day}-${month}-${year}`;
}

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

export const dateToDdMonYyyy = (dateString: string) => {
  const date = new Date(dateString);
  const formatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

  return formatted;
};
