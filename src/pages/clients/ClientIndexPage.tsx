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
import { useState } from "react";
import { useDebounce } from "../../hooks/debounce.hook";
import { TableOptions } from "../../components/common/TableOptions";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import { ClientCreationForm } from "../../components/clients/ClientCreationForm";

export function ClientIndexPage() {
  const columns: ColumnDef<TableFeatures, ClientDataWithFilters>[] = [
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
  ];

  const hiddenCols: ColumnVisibilityState = {
    activityCount: false,
    createdAt: false,
  };

  const [searchParam, setSearchParam] = useState("");
  const [clientData, setClientData] =
    useState<ClientDataWithFilters[]>(mockClientData);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [isPopoverOpen, toggleIsPopoverOpen] = useState(false);
  const debouncedSearchParam = useDebounce({ value: searchParam, delay: 500 });
  const localFilter: ColumnFiltersState = [
    {
      id: "client",
      value: debouncedSearchParam,
    },
  ];

  return (
    <>
      <div className="relative px-6 pt-6 flex flex-col gap-6 pb-40">
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
            searchTerm={searchParam}
            setSearchTerm={setSearchParam}
          />
          <CustomDataTable
            columns={columns}
            data={clientData}
            hiddenCols={hiddenCols}
            localFilters={localFilter}
            showPaginated={true}
            totalRecords={clientData.length}
            pagination={pagination}
            setPagination={setPagination}
          />
        </div>
      </div>
    </>
  );
}
