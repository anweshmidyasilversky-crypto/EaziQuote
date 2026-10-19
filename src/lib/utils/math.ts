export const applyPercentage = (base: number, percentage: number) =>
  (base * percentage) / 100;

export function calcMarginPercentage(
  price: number | undefined,
  cost: number | undefined,
) {
  if (!price || cost === undefined) {
    return 0;
  }

  const margin = ((price - cost) / price) * 100;
  return Math.round(margin); // Returns a whole number
}

export function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}
