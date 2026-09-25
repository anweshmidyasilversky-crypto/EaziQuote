import { showErrorToast } from "@/api/axiosInstance";
import { getPresetQuoteList } from "@/api/services/auth.api";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

function usePresetQuotesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm });
  const [pageNo, setPageNo] = useState(1);
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["preset_quotes_list", debouncedSearchTerm],
    queryFn: () =>
      getPresetQuoteList({
        search:
          debouncedSearchTerm.length > 0 ? debouncedSearchTerm : undefined,
        page: pageNo,
      }),
  });

  useMemo(() => setPageNo(1), [debouncedSearchTerm, pageNo]);

  if (error) {
    showErrorToast(error);
  }

  return {
    presetQuoteList: data?.payload.data ?? [],
    paginationMeta: data?.payload.meta,
    setPageNo,
    searchTerm,
    setSearchTerm,
    isFetching,
    refetch,
  };
}

export default usePresetQuotesList;
