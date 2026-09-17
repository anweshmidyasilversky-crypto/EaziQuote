import { showErrorToast } from "@/api/axiosInstance";
import { getQuoteList } from "@/api/services/auth.api";
import { useDebounce } from "@/hooks/useDebounce";
import type { PageFilters } from "@/types/api.requests.type";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export type useQuoteListProps = {
  filters?: PageFilters;
};

function useQuoteList({ filters }: useQuoteListProps) {
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm });
  const {
    data: quotes,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["quotes_list", pageNo, filters, debouncedSearchTerm],
    queryFn: () =>
      getQuoteList({
        ...filters,
        search:
          debouncedSearchTerm.trim.length > 0 ? debouncedSearchTerm : undefined,
        page: pageNo,
      }),
  });

  if (error) {
    showErrorToast(error);
  }

  useMemo(() => setPageNo(1), [debouncedSearchTerm, filters]);

  return {
    quoteList: quotes?.payload.data ?? [],
    quoteSummary: quotes?.payload.summary,
    paginationMeta: quotes?.payload.meta,
    setPageNo,
    isFetching,
    setSearchTerm,
    searchTerm,
  };
}

export default useQuoteList;
