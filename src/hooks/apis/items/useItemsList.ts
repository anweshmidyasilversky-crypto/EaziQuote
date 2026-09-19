import { showErrorToast } from "@/api/axiosInstance";
import { getItemList } from "@/api/services/items.api";
import { useDebounce } from "@/hooks/useDebounce";
import type { PageFilters } from "@/types/api.requests.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export type useItemListProps = {
  filters?: PageFilters;
};

function useItemsList({ filters }: useItemListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const deboucedSearchTerm = useDebounce({ value: searchTerm });
  const [pageNo, setPageNo] = useState(1);

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error,
  } = useInfiniteQuery({
    queryKey: ["items", deboucedSearchTerm, pageNo, filters],
    initialPageParam: pageNo,
    queryFn: ({ pageParam }) =>
      getItemList({
        ...filters,
        search: deboucedSearchTerm,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const meta = lastPage.payload.meta;
      if (meta.current_page < meta.last_page) {
        return meta.current_page + 1;
      }
      return undefined;
    },
  });

  if (error) {
    showErrorToast(error);
  }

  useMemo(() => setPageNo(1), [deboucedSearchTerm, filters]);

  const itemsList = data?.pages.flatMap((page) => page.payload.data) ?? [];

  return {
    itemsList,
    paginationMeta: data ? data.pages.at(-1)?.payload.meta : undefined,
    isFetching,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
    searchTerm,
    setSearchTerm,
    setPageNo,
  };
}

export default useItemsList;
