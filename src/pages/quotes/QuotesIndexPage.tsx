import {
  filterFn_includesString,
  type PaginationState,
  type ColumnDef,
  type TableFeatures,
} from "@tanstack/react-table";
import { assets } from "../../assets/icons";
import {
  ActivitySummary,
  type ActivitySummaryProps,
} from "../../components/clients/ActivitySummary";
import { type CustomBtnProps } from "../../components/common/CustomBtn";
import {
  quoteData,
  type QuoteActivityStatus,
  type QuoteData,
} from "../../constants/dummyData";
import { useMemo, useState } from "react";
import { formatCurrency } from "../../lib/utils";
import { CustomActionGroup } from "../../components/common/CustomActionGroup";
import StatusBadge from "../../components/common/StatusBadge";
import { CustomDataTable } from "../../components/common/CustomTable";
import { ClientNameBadge } from "../../components/common/ClientNameBadge";
import { useDebounce } from "../../hooks/debounce.hook";
import SearchInputGruop from "../../components/common/SearchInputGruop";
import FilterBtn from "../../components/common/FilterBtn";
import { TableFilterSheet } from "../../components/common/TableFilterSheet";
import {
  RenderMultiSelectCheckbox,
  type CheckboxConfig,
} from "../../components/common/RenderMultiSelectCheckbox";
import {
  type DateRange,
  DateRangePicker,
} from "../../components/common/DateRangePicket";
import { CustomHeader } from "../../components/common/CustomHeader";
import { useNavigate } from "react-router";

export function QuotesIndexPage() {
  const summary: ActivitySummaryProps["summaryConfig"] = [
    {
      summaryTitle: "Total Quotes",
      summary: 64,
      summaryIcon: assets.invoiceColored,
    },
    {
      summaryTitle: "Accepted",
      summary: "16",
      summaryIcon: assets.greenTickIcon,
    },
    {
      summaryTitle: "Pending",
      summary: "16",
      summaryIcon: assets.orangeClockIcon,
    },
    {
      summaryTitle: "Expired",
      summary: "6",
      summaryIcon: assets.OrangeHourGlassIcon,
    },
  ];
  const navigate = useNavigate();

  const quoteColumns: ColumnDef<TableFeatures, QuoteData>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "TITLE",
        enableSorting: false,
        filterFn: filterFn_includesString,
      },
      {
        accessorKey: "quote",
        header: "QUOTE",
        enableSorting: false,
        filterFn: filterFn_includesString,
      },
      {
        accessorKey: "client",
        header: "CLIENT",
        cell: (info) => {
          const client = info.getValue<QuoteData["client"]>();

          return <ClientNameBadge name={client} />;
        },
        enableSorting: false,
        filterFn: filterFn_includesString,
      },
      {
        accessorKey: "amount",
        header: "AMOUNT",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableGlobalFilters: false,
        // Sorting intentionally enabled
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: (info) => {
          const status = info.getValue<QuoteActivityStatus>();

          return <StatusBadge status={status} />;
        },
        enableSorting: false,
        enableGlobalFilters: false,
      },
      {
        accessorKey: "creationDate",
        header: "CREATION DATE",
        enableSorting: false,
        enableGlobalFilters: false,
      },
      {
        accessorKey: "expiryDate",
        header: "EXPIRY DATE",
        enableSorting: false,
        enableGlobalFilters: false,
      },
      {
        id: "actions",
        header: "ACTION",
        cell: ({ row }) => {
          const quote = row.original;

          return (
            <CustomActionGroup openFn={() => navigate(`/quotes/${quote.id}`)} />
          );
        },
        enableSorting: false,
        enableGlobalFilters: false,
      },
    ],
    [],
  );

  const checkboxConfig: CheckboxConfig = useMemo(
    () => [
      {
        id: "draft",
        label: "Draft",
        value: "draft",
      },
      {
        id: "completed",
        label: "Completed",
        value: "completed",
      },
      {
        id: "sent",
        label: "Sent",
        value: "sent",
      },
      {
        id: "approved",
        label: "Approved",
        value: "approved",
      },
      {
        id: "paid",
        label: "Paid",
        value: "paid",
      },
      {
        id: "rejected",
        label: "Rejected",
        value: "rejected",
      },
      {
        id: "cancelled",
        label: "Cancelled",
        value: "cancelled",
      },
    ],
    [],
  );

  const [quotes, setQuotes] = useState(quoteData);
  const [searchParam, setSearchParam] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchParam, delay: 500 });
  const [filerOpen, toggleFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const [filters, setFilters] = useState<string[]>([]);

  const btnConfigList: CustomBtnProps[] = [
    {
      leftIcon: assets.plusIcon,
      buttonLabel: "New Quote",
    },
  ];

  return (
    <div className="p-6 pb-7.5 flex flex-col gap-6">
      {/* Header */}
      <CustomHeader
        header="Quotes"
        headerInfo="Manage all your quotes in one place"
        btnConfigList={btnConfigList}
      />

      {/* Summary */}
      <ActivitySummary summaryConfig={summary} />

      {/* Table */}
      <div className="table-theme">
        <CustomDataTable
          columns={quoteColumns}
          data={quotes}
          tableOptionsLeft={
            <SearchInputGruop
              searchTerm={searchParam}
              setSearchTerm={setSearchParam}
              searchPlaceHolder="Search quotes & clients"
            />
          }
          tableOptionsRight={
            <FilterBtn toggleFilterSheetOpen={toggleFilterOpen} />
          }
          globalFilterTerm={debouncedSearchTerm}
          showPaginated={true}
        />
      </div>

      <TableFilterSheet isOpen={filerOpen} toggleIsOpen={toggleFilterOpen}>
        <div className="flex flex-col gap-6 mt-6 px-5">
          <div className="min-h-25.5 flex flex-col gap-4">
            <span className="text-placeholder-text min-h-4.25 font-medium text-sm">
              {" "}
              Date Range{" "}
            </span>
            <DateRangePicker
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-placeholder-text min-h-4.25 font-medium text-sm">
              {" "}
              Status{" "}
            </span>
            <RenderMultiSelectCheckbox
              checkboxconfig={checkboxConfig}
              selectedFilters={filters}
              toggleSelectedFilters={setFilters}
            />
          </div>
        </div>
      </TableFilterSheet>
    </div>
  );
}
