import type { PageFilters } from "@/types/api.requests.type";
import { useState } from "react";

export type usePaginationResetProps = {
  setPageNo: React.Dispatch<React.SetStateAction<number>>;
  filters: PageFilters;
};
function usePaginationReset({ setPageNo, filters }: usePaginationResetProps) {
  const [committed, setCommitted] = useState({
    filters,
  });

  if (committed.filters !== filters) {
    setCommitted({ filters });
    setPageNo(1);
  }
}

export default usePaginationReset;
