import { getClientList } from "@/api/services/clients.api";
import type { PageFilters } from "@/types/api.requests.type";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useDebounce } from "../../useDebounce";
import { showErrorToast } from "@/api/axiosInstance";
import usePaginationReset from "../usePaginationReset";

export type useClientsProps = {
  filters?: PageFilters;
};

function useClients({ filters }: useClientsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm });
  const [pageNo, setPageNo] = useState(1);

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["clients", filters, debouncedSearchTerm, pageNo],
    queryFn: () =>
      getClientList({
        search:
          debouncedSearchTerm.length > 0 ? debouncedSearchTerm : undefined,
        ...filters,
        page: pageNo,
      }),
  });

  useMemo(() => setPageNo(1), [debouncedSearchTerm, filters]);

  // usePaginationReset({
  //   setPageNo,
  //   filters: pageFilters,
  // });

  if (error) {
    showErrorToast(error);
  }

  return {
    clientList: data?.payload.data ?? [],
    clientListMeta: data ? data.payload.meta : undefined,
    isFetching,
    refetch,
    searchTerm,
    setSearchTerm,
    setPageNo,
    pageNo,
  };
}

export default useClients;
