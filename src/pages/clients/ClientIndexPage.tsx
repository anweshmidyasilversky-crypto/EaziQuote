import { assets } from "../../assets/icons";
import { CustomBtn } from "../../components/common/CustomBtn";
import {
  filterFn_includesString,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type TableFeatures,
} from "@tanstack/react-table";
import {
  mockClientData,
  type ClientDataWithFilters,
} from "../../constants/dummyData";
import { CustomActionGroup } from "../../components/common/CustomActionGroup";
import { ClientNameBadge } from "../../components/common/ClientNameBadge";
import { CustomDataTable } from "../../components/common/CustomTable";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../hooks/debounce.hook";
import { TableOptions } from "../../components/common/TableOptions";

import { ClientCreationForm } from "../../components/clients/ClientCreationForm";
import { TableFilterSheet } from "../../components/common/TableFilterSheet";

export function ClientIndexPage() {
  const columns = useMemo(
    () =>
      [
        {
          accessorKey: "client",
          header: "CLIENT",
          filterFn: filterFn_includesString,
          cell: (info) => <ClientNameBadge name={info.getValue<string>()} />,
        },
        {
          accessorKey: "company",
          header: "COMPANY",
        },
        {
          accessorKey: "phone",
          header: "PHONE",
          enableSorting: false,
        },
        {
          accessorKey: "email",
          header: "EMAIL",
          enableSorting: false,
        },
        {
          accessorKey: "activityCount",
        },
        {
          accessorKey: "createdAt",
        },
        {
          id: "actions",
          header: "ACTION",
          enableSorting: false,
          cell: () => <CustomActionGroup />,
        },
      ] as ColumnDef<TableFeatures, ClientDataWithFilters>[],
    [],
  );

  const hiddenCols: ColumnVisibilityState = useMemo(
    () => ({
      activityCount: false,
      createdAt: false,
    }),
    [],
  );

  const [searchParam, setSearchParam] = useState("");
  const [clientData, setClientData] = useState<ClientDataWithFilters[]>(
    mockClientData.toSorted(
      (client1, client2) =>
        new Date(client2.createdAt).getTime() -
        new Date(client1.createdAt).getTime(),
    ),
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [isPopoverOpen, toggleIsPopoverOpen] = useState(false);

  {
    /* Handle filters */
  }
  const filters: { label: string; value: string }[] = useMemo(
    () => [
      {
        value: "asc",
        label: "A-Z",
      },
      {
        value: "desc",
        label: "Z-A",
      },
      {
        value: "recent",
        label: "Recently Added",
      },
      {
        value: "active",
        label: "Most Active",
      },
    ],
    [],
  );
  const [activeFilter, toggleActiveFilter] = useState<string>("recent");
  const [isFilterOpen, toggleFilterOpen] = useState(false);
  let tableData = clientData;
  const getFilteredData = (filter: string) => {
    let res = clientData;
    switch (filter) {
      case "asc":
        res = tableData.toSorted((client1, client2) =>
          client1.client.localeCompare(client2.client),
        );
        break;

      case "desc":
        res = tableData.toSorted((client1, client2) =>
          client2.client.localeCompare(client1.client),
        );
        break;

      case "recent":
        res = tableData.toSorted(
          (client1, client2) =>
            new Date(client2.createdAt).getTime() -
            new Date(client1.createdAt).getTime(),
        );
        break;

      case "active":
        res = tableData.toSorted(
          (client1, client2) => client2.activityCount - client1.activityCount,
        );
    }
    return res;
  };
  const applyFiler = () => setClientData(getFilteredData(activeFilter));
  const clearFilter = () => {
    toggleActiveFilter("recent");
    setClientData(getFilteredData("recent"));
  };
  const debouncedSearchParam = useDebounce({ value: searchParam, delay: 500 });
  const localFilter: ColumnFiltersState = useMemo(
    () => [
      {
        id: "client",
        value: debouncedSearchParam,
      },
    ],
    [debouncedSearchParam],
  );
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearchParam]);

  return (
    <>
      <div className="relative px-6 pt-6 pb-5 flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center w-full min-h-13.5">
          <div className="flex flex-col items-center gap-2 h-full">
            <span className="min-h-7.25 font-bold text-xl md:text-2xl self-start">
              {" "}
              Clients{" "}
            </span>
            <span className="min-h-4.25 text-placeholder-text text-[14px]">
              {" "}
              Manage all your clients{" "}
            </span>
          </div>

          <CustomBtn
            leftIcon={assets.plusIcon}
            buttonLabel="Add Client"
            onClick={() => toggleIsPopoverOpen((curr) => !curr)}
          />
          <ClientCreationForm
            setClientData={setClientData}
            isFormOpen={isPopoverOpen}
            formCloseAction={toggleIsPopoverOpen}
          />
        </div>

        <div className="flex flex-col bg-table rounded-[10px] dashboard-card-theme gap-4.5 py-4.5">
          <TableOptions
            toggleFilterSheetOpen={toggleFilterOpen}
            searchTerm={searchParam}
            setSearchTerm={setSearchParam}
          />
          <CustomDataTable
            columns={columns}
            data={clientData}
            hiddenCols={hiddenCols}
            localFilters={localFilter}
            showPaginated={true}
            pagination={pagination}
            setPagination={setPagination}
          />
        </div>

        <TableFilterSheet
          isOpen={isFilterOpen}
          toggleIsOpen={toggleFilterOpen}
          applyFn={applyFiler}
          clearFn={clearFilter}
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
            <span className="text-placeholder-text text-sm font-semibold">
              SORT BY
            </span>

            {filters.map((filter) => (
              <span key={filter.label} className="flex items-center gap-2">
                <input
                  id={filter.value}
                  type="radio"
                  checked={filter.value === activeFilter}
                  value={filter.value}
                  onChange={(e) => toggleActiveFilter(e.target.value)}
                />
                <label htmlFor={filter.value} className="cursor-pointer">
                  {filter.label}
                </label>
              </span>
            ))}
          </div>
        </TableFilterSheet>
      </div>
    </>
  );
}
