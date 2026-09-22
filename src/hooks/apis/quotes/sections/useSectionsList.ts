import { showErrorToast } from "@/api/axiosInstance";
import { getQuoteSectionList } from "@/api/services/proposalDocument.api";
import { useDebounce } from "@/hooks/useDebounce";
import type { PageFilters } from "@/types/api.requests.type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export type useSectionsListProps = {
  filters?: PageFilters;
};

function useSectionsList({ filters }: useSectionsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const deboucedSearchTerm = useDebounce({ value: searchTerm });
  const {
    data: responseData,
    error,
    isFetching,
    refetch,
    isFetched,
  } = useQuery({
    queryKey: ["section_list", deboucedSearchTerm],
    queryFn: () =>
      getQuoteSectionList({
        ...filters,
        search: deboucedSearchTerm,
      }),
  });

  if (error) {
    showErrorToast(error);
  }

  const [data, setData] = useState(responseData?.payload.data ?? []);

  useEffect(() => {
    setData(responseData?.payload.data ?? []);
  }, [responseData?.payload.data]);

  return {
    sectionList: data,
    setData,
    searchTerm,
    setSearchTerm,
    isFetching,
    refetch,
    isFetched,
  };
}

export default useSectionsList;
