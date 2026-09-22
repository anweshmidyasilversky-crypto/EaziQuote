import { showErrorToast } from "@/api/axiosInstance";
import { getSectionListByQuote } from "@/api/services/proposalDocument.api";
import type { PageFilters } from "@/types/api.requests.type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
export type useSectionListByQuoteProps = {
  quote_id: string | number;
  filters?: PageFilters;
  enabled?: boolean;
};
function useSectionListByQuote({
  quote_id,
  filters,
  enabled = true,
}: useSectionListByQuoteProps) {
  const [pageNo, setPageNo] = useState(1);
  const { data, error, isFetching } = useQuery({
    queryKey: [`section_list_by_quote`, pageNo],
    queryFn: () =>
      getSectionListByQuote(quote_id, {
        ...filters,
        page: pageNo,
      }),
    enabled,
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    sectionList: data?.payload.data ?? [],
    isFetching,
    setPageNo,
    paginationMeta: data?.payload.meta,
  };
}

export default useSectionListByQuote;
