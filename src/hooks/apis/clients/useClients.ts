import { getClientList } from "@/api/services/clients.api";

import type { PageFilters } from "@/types/api.requests.type";

import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";

import { useEffect, useMemo, useState } from "react";

import { useDebounce } from "../../useDebounce";

import { showErrorToast } from "@/api/axiosInstance";

export type useClientsProps = {
  filters?: PageFilters;
  initialSearchVal?: string;
  enabled?: boolean;
};

function useClients({ filters, enabled = true }: useClientsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce({
    value: searchTerm,
  });

  const [pageNo, setPageNo] = useState(1);

  const {
    data,
    isFetching,
    isFetchingNextPage,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["clients", filters, debouncedSearchTerm, pageNo],

    initialPageParam: pageNo,

    queryFn: ({ pageParam }) =>
      getClientList({
        ...filters,
        search:
          debouncedSearchTerm.length > 0 ? debouncedSearchTerm : undefined,
        page: pageParam,
      }),

    getNextPageParam: (lastPage) => {
      const meta = lastPage.payload.meta;

      // Adjust these fields according to your actual API response.
      if (meta.current_page < meta.last_page) {
        return meta.current_page + 1;
      }

      return undefined;
    },

    enabled,
  });

  useMemo(() => setPageNo(1), [debouncedSearchTerm, filters]);

  // Flatten all fetched pages into one client list.
  const clientList = useMemo(
    () => data?.pages.flatMap((page) => page.payload.data) ?? [],
    [data],
  );

  // Meta of the latest fetched page.
  const clientListMeta = data
    ? data.pages[data.pages.length - 1].payload.meta
    : undefined;

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  return {
    clientList,
    clientListMeta,

    isFetching,
    isFetchingNextPage,
    hasNextPage,

    fetchNextPage,
    refetch,

    searchTerm,
    setSearchTerm,

    setPageNo,

    // Keep pageNo if your existing components use it.
    // For infinite scroll, fetchNextPage is preferred.
    pageNo: data?.pages.length ?? 1,
  };
}

export default useClients;
