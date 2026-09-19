import { showErrorToast } from "@/api/axiosInstance";
import { getCategoryList } from "@/api/services/categories.api";
import { useDebounce } from "@/hooks/useDebounce";
import type { PageFilters } from "@/types/api.requests.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export type useCategoriesListProps = {
  filters?: PageFilters;
};

function useCategoriesList({ filters }: useCategoriesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm });
  const [pageNo, setPageNo] = useState(1);
  const {
    data,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["category_list", debouncedSearchTerm, filters, pageNo],
    initialPageParam: pageNo,
    queryFn: ({ pageParam }) =>
      getCategoryList({
        ...filters,
        search:
          debouncedSearchTerm.trim().length > 0
            ? debouncedSearchTerm
            : undefined,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const meta = lastPage.payload.meta;
      if (meta.current_page >= meta.last_page) {
        return undefined;
      }
      return meta.current_page + 1;
    },
  });

  useMemo(() => setPageNo(1), [debouncedSearchTerm, filters]);

  const categoryList = useMemo(
    () => data?.pages.flatMap((page) => page.payload.data) ?? [],
    [data],
  );

  if (error) {
    showErrorToast(error);
  }

  return {
    categoryList,
    setPageNo,
    searchTerm,
    setSearchTerm,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    hasNextPage,
    paginationMeta: data ? data.pages.at(-1)?.payload.meta : undefined,
  };
}

export default useCategoriesList;
