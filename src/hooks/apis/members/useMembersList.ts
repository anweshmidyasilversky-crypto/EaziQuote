import { showErrorToast } from "@/api/axiosInstance";
import { getTeamMemberList } from "@/api/services/members.api";
import { useDebounce } from "@/hooks/useDebounce";
import type { PageFilters } from "@/types/api.requests.type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export type useMembersListProps = {
  filters?: PageFilters;
  enabled?: boolean;
};

function useMembersList({ filters, enabled = true }: useMembersListProps) {
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm });

  const { data, isFetching, error, refetch, isLoading } = useQuery({
    queryKey: ["team_member", pageNo, debouncedSearchTerm],
    queryFn: () =>
      getTeamMemberList({
        ...filters,
        search:
          debouncedSearchTerm.trim().length >= 1
            ? debouncedSearchTerm
            : undefined,
        page: pageNo,
      }),
    enabled,
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    memberList: data?.payload.data ?? [],
    isFetching,
    refetch,
    setPageNo,
    setSearchTerm,
    searchTerm,
    paginationMeta: data?.payload.meta,
    isLoading,
    queryKey: ["team_member", pageNo, debouncedSearchTerm],
  };
}

export default useMembersList;
