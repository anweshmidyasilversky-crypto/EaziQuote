import { showErrorToast } from "@/api/axiosInstance";
import { subCategoryByCategory } from "@/api/services/subCategories.api";
import { useDebounce } from "@/hooks/useDebounce";
import type { PageFilters } from "@/types/api.requests.type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export type useSubcategoryByCategoryProps = {
  catId: string | number;
  filters?: PageFilters;
  enabled?: boolean;
};

function useSubcategoryByCategory({
  catId,
  filters,
  enabled = true,
}: useSubcategoryByCategoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm });
  const { data, isFetching, error, refetch, isFetched } = useQuery({
    queryKey: ["subcategory_by_category", catId, filters, debouncedSearchTerm],
    queryFn: () =>
      subCategoryByCategory(catId, {
        ...filters,
        search:
          debouncedSearchTerm.trim().length > 0
            ? debouncedSearchTerm
            : undefined,
      }),
    enabled,
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    subCategories: data?.payload ?? [],
    isFetching,
    refetch,
    searchTerm,
    setSearchTerm,
    isFetched,
  };
}

export default useSubcategoryByCategory;
