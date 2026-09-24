import { showErrorToast } from "@/api/axiosInstance";
import { getPaymentListByClient } from "@/api/services/payments.api";
import { useDebounce } from "@/hooks/useDebounce";
import type { PageFilters } from "@/types/api.requests.type";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export type usePaymentsByClientProps = {
  filters?: PageFilters;
};

function usePaymentsList({ filters }: usePaymentsByClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm });
  const [pageNo, setPageNo] = useState(1);
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["payments", filters, pageNo, debouncedSearchTerm],
    queryFn: () =>
      getPaymentListByClient({
        ...filters,
        search:
          debouncedSearchTerm.trim().length >= 1
            ? debouncedSearchTerm
            : undefined,
        page: pageNo,
      }),
  });

  if (error) {
    showErrorToast(error);
  }

  useMemo(() => setPageNo(1), [filters, debouncedSearchTerm]);

  return {
    paymentList: data?.payload.data ?? [],
    isFetching,
    paymentPaginationMeta: data?.payload.meta,
    setPageNo,
    searchTerm,
    setSearchTerm,
    refetch,
    paginationMeta: data?.payload.meta,
  };
}

export default usePaymentsList;
