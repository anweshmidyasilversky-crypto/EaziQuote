import { useCallback, useState } from "react";

export type useCounterProps = {
  initialValue: number;
  minLimit?: number;
  maxLimit?: number;
};

export function useCounter({
  initialValue,
  minLimit,
  maxLimit,
}: useCounterProps) {
  const [counter, setCounter] = useState(initialValue);
  const increment = useCallback(
    () =>
      setCounter((curr) =>
        maxLimit ? Math.min(curr + 1, maxLimit) : curr + 1,
      ),
    [],
  );
  const decrement = useCallback(
    () =>
      setCounter((curr) =>
        minLimit ? Math.max(curr - 1, minLimit) : curr - 1,
      ),
    [],
  );
  return { counter, increment, decrement };
}
