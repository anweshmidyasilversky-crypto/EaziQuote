import type { PageFilters } from "@/types/api.requests.type";
import { useEffect, useState } from "react";

export type usePaginationProps = {
  filters?: PageFilters;
  page: number;
};

function usePagination({
  filters,
  page,
}: usePaginationProps): [number, (pageNumber: number) => void] {
  const [pageNo, setPageNo] = useState(page);
  useEffect(() => {
    setPageNo(1);
  }, [filters]);
  return [pageNo, (pageNumber) => setPageNo(pageNumber)];
}

export default usePagination;
