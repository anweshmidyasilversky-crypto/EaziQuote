import { useEffect, useState } from "react";

export type useDebounceProps<T> = {
  value: T;
  delay?: number;
};
export function useDebounce<T>({ value, delay = 500 }: useDebounceProps<T>) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(id);
  }, [value]);

  return debouncedValue;
}
