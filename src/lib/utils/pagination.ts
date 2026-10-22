export type PageItem = number | "ellipsis-start" | "ellipsis-end";

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

export function getPageItems(
  current: number,
  last: number,
  siblings = 1,
): PageItem[] {
  if (last <= 0) return [];

  // first + last + current + 2 ellipses + siblings on both sides
  const totalSlots = siblings * 2 + 5;
  if (last <= totalSlots) return range(1, last);

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, last);

  const showLeftDots = left > 2;
  const showRightDots = right < last - 1;
  const edgeCount = 3 + 2 * siblings;

  if (!showLeftDots && showRightDots) {
    return [...range(1, edgeCount), "ellipsis-end", last];
  }
  if (showLeftDots && !showRightDots) {
    return [1, "ellipsis-start", ...range(last - edgeCount + 1, last)];
  }
  return [1, "ellipsis-start", ...range(left, right), "ellipsis-end", last];
}
