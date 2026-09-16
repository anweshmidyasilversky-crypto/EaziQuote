import { showErrorToast } from "@/api/axiosInstance";
import { getPaymentListByClient } from "@/api/services/payments.api";
import type { PageFilters } from "@/types/api.requests.type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export type usePaymentsByClientProps = {
  client_id: string | number;
  filters?: PageFilters;
};

function usePaymentsByClient({ client_id, filters }: usePaymentsByClientProps) {
  const [pageNo, setPageNo] = useState(1);
  const { data, isFetching, error } = useQuery({
    queryKey: ["payments", client_id],
    queryFn: () =>
      getPaymentListByClient(client_id, {
        ...filters,
        page: pageNo,
      }),
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    paymentList: data?.payload.data ?? [],
    isFetching,
    paymentPaginationMeta: data?.payload.meta,
    setPageNo,
  };
}

export default usePaymentsByClient;
