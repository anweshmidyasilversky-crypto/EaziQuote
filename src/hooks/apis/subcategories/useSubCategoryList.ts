import { showErrorToast } from "@/api/axiosInstance";
import { getSubCatList } from "@/api/services/subCategories.api";
import { useDebounce } from "@/hooks/useDebounce";
import type { PageFilters } from "@/types/api.requests.type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export type useSubCategoryListProps = {
  filters?: PageFilters;
};

function useSubCategoryList({ filters }: useSubCategoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm });
  const [pageNo, setPageNo] = useState(1);
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["subCategories", debouncedSearchTerm, pageNo],
    queryFn: () =>
      getSubCatList({
        ...filters,
        search: debouncedSearchTerm,
        page: pageNo,
      }),
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    subcategories: data?.payload.data ?? [],
    paginationMeta: data?.payload.meta,
    searchTerm,
    setSearchTerm,
    setPageNo,
    pageNo,
    isFetching,
    refetch,
  };
}

export default useSubCategoryList;
