import { showErrorToast } from "@/api/axiosInstance";
import { getDepositeQuotes } from "@/api/services/quotes.api";
import { useDebounce } from "@/hooks/useDebounce";
import type { PageFilters } from "@/types/api.requests.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export type useDepositQuotesProps = {
  filters?: PageFilters;
  enabled?: boolean;
};

function useDepositQuotes({ filters, enabled }: useDepositQuotesProps) {
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce({
    value: searchTerm,
  });

  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["quotes_list", filters, pageNo, debouncedSearchTerm],

    initialPageParam: pageNo,

    queryFn: ({ pageParam }) =>
      getDepositeQuotes({
        ...filters,
        search:
          debouncedSearchTerm.trim().length > 0
            ? debouncedSearchTerm
            : undefined,
        page: pageParam,
      }),

    getNextPageParam: (lastPage) => {
      const meta = lastPage.payload.meta;

      if (meta.current_page < meta.last_page) {
        return meta.current_page + 1;
      }

      return undefined;
    },

    enabled,
  });

  /*
   * Reset table pagination when search/filter changes.
   */
  useEffect(() => {
    setPageNo(1);
  }, [debouncedSearchTerm, filters]);

  /*
   * All pages fetched so far.
   */
  const depositQuotes = useMemo(
    () => data?.pages.flatMap((page) => page.payload.data) ?? [],
    [data],
  );

  /*
   * Meta of the latest fetched page.
   */
  const paginationMeta = data
    ? data.pages[data.pages.length - 1].payload.meta
    : undefined;

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  return {
    // Infinite-scroll data
    depositQuotes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,

    // General query state
    isFetching,
    refetch,
    error,

    // Table pagination
    pageNo,
    setPageNo,
    paginationMeta,

    // Search
    searchTerm,
    setSearchTerm,
  };
}

export default useDepositQuotes;
