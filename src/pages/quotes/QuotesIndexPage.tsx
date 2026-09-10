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
  presetQuoteData,
  type PresetQuote,
  type QuoteActivityStatus,
  type QuoteData,
} from "../../constants/dummyData";
import { useMemo, useState } from "react";
import {
  cn,
  formatCurrency,
  formatDisplayDate,
  formatOrdinalDate,
  quoteToDisplayData,
} from "../../lib/utils";
import { CustomActionGroup } from "../../components/common/CustomActionGroup";
import StatusBadge from "../../components/common/StatusBadge";
import { CustomDataTable } from "../../components/common/CustomTable";
import { ClientNameBadge } from "../../components/common/ClientNameBadge";
import { useDebounce } from "../../hooks/useDebounce";
import SearchInputGruop from "../../components/common/SearchInputGruop";
import FilterBtn from "../../components/common/FilterBtn";
import { CustomSheet } from "../../components/common/CustomSheet";
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
import React from "react";
import CustomDialog from "../../components/common/CustomDialog";
import { useQuery } from "@tanstack/react-query";
import { getQuoteList } from "@/api/auth.api";
import { showErrorToast } from "@/api/axiosInstance";
import type { Quote } from "@/types/api.responses.type";

export function QuotesIndexPage() {
  const navigate = useNavigate();
  const [searchParam, setSearchParam] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchParam, delay: 500 });
  const [filerOpen, toggleFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const [filters, setFilters] = useState<string[]>([]);
  const [quoteDialogOpen, toggleQuoteDialogOpen] = useState(false);
  const [presetSelectionOpen, togglePresetSelectionOpen] = useState(false);
  const [presetSearchTerm, setPresetSearchTerm] = useState("");
  const debouncedPresetSearchTerm = useDebounce({
    value: presetSearchTerm,
    delay: 500,
  });

  const [pageNo, setPageNo] = useState(1);

  const {
    data: quotes,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["quotes", pageNo, filters, dateRange],
    queryFn: () =>
      getQuoteList({
        page: pageNo,
        status: filters,
        start_date: dateRange.startDate?.toDateString(),
        end_date: dateRange.endDate?.toDateString(),
      }),
  });
  const quoteItemStartNo =
    (pageNo - 1) * (quotes?.payload.meta.per_page ?? 0) + 1;
  const quoteItemEndNo = quoteItemStartNo + (quotes?.payload.data?.length ?? 0);

  if (isError) {
    showErrorToast(error);
  }
  const QuoteSummmary = quotes?.payload.summary;

  const summary: ActivitySummaryProps["summaryConfig"] = useMemo(() => {
    return [
      {
        summaryTitle: "Total Quotes",
        summary: QuoteSummmary?.total_count,
        summaryIcon: assets.invoiceColored,
      },
      {
        summaryTitle: "Accepted",
        summary: QuoteSummmary?.accepted_count,
        summaryIcon: assets.greenTickIcon,
      },
      {
        summaryTitle: "Pending",
        summary: QuoteSummmary?.pending_count,
        summaryIcon: assets.orangeClockIcon,
      },
      {
        summaryTitle: "Expired",
        summary: QuoteSummmary?.expired_count,
        summaryIcon: assets.OrangeHourGlassIcon,
      },
    ];
  }, [quotes]);

  const quoteColumns: ColumnDef<TableFeatures, Quote>[] = useMemo(
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
        accessorKey: "name",
        header: "CLIENT",
        cell: (info) => {
          const client = info.getValue<QuoteData["client"]>();
          return <ClientNameBadge name={client} />;
        },
        enableSorting: false,
        filterFn: filterFn_includesString,
      },
      {
        accessorKey: "price",
        header: "AMOUNT",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableGlobalFilters: false,
        // Sorting intentionally enabled for amount
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
        accessorKey: "created_at",
        header: "CREATION DATE",
        cell: (info) => {
          const date = info.getValue<string | undefined>();
          if (date) {
            return formatDisplayDate(date);
          }
        },
        enableSorting: false,
        enableGlobalFilters: false,
      },
      {
        accessorKey: "expiry_at",
        header: "EXPIRY DATE",
        cell: (info) => {
          const date = info.getValue<string | undefined>();
          if (date) {
            return formatDisplayDate(date);
          }
        },
        enableSorting: false,
        enableGlobalFilters: false,
      },
      {
        id: "actions",
        header: "ACTION",
        cell: ({ row }) => {
          const quote = row.original;
          return (
            <CustomActionGroup
              openFn={() => navigate(`/quotes/${quote.id}`)}
              editFn={() => navigate(`/quotes/manage-quotes/${quote.id}`)}
              withEdit={row.original.is_editable}
            />
          );
        },
        enableSorting: false,
        enableGlobalFilters: false,
      },
    ],
    [],
  );

  const [selectedPreset, setSelectedPreset] = useState<string>("");

  const presetQuotesColumns = useMemo(
    () =>
      [
        {
          id: "action",
          header: "ACTION",
          cell: (info) => (
            <input
              type="radio"
              multiple
              value={info.row.original.id}
              checked={info.row.original.id === selectedPreset}
              onChange={(e) => {
                setSelectedPreset(e.target.value);
              }}
            />
          ),
          enableSorting: false,
        },

        {
          accessorKey: "templateName",
          header: "TEMPLATE NAME",
          enableSorting: false,
        },

        {
          accessorKey: "items",
          header: "ITEMS",
          enableSorting: false,
        },

        {
          accessorKey: "description",
          header: "Description",
          cell: (info) => {
            const desc = info.getValue<string>();
            return <span className="text-wrap min-w-177.5"> {desc} </span>;
          },
          enableSorting: false,
        },
      ] as ColumnDef<TableFeatures, PresetQuote>[],
    [selectedPreset],
  );

  const checkboxConfig: CheckboxConfig = useMemo(
    () => [
      { id: "draft", label: "Draft", value: "draft" },
      { id: "completed", label: "Completed", value: "completed" },
      { id: "sent", label: "Sent", value: "sent" },
      { id: "approved", label: "Approved", value: "approved" },
      { id: "paid", label: "Paid", value: "paid" },
      { id: "rejected", label: "Rejected", value: "rejected" },
      { id: "cancelled", label: "Cancelled", value: "cancelled" },
    ],
    [],
  );

  const btnConfigList: CustomBtnProps[] = [
    {
      leftIcon: assets.plusIcon,
      buttonLabel: "New Quote",
      onClick: () => toggleQuoteDialogOpen((curr) => !curr),
    },
  ];

  return (
    <React.Fragment>
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
            data={quotes?.payload.data ?? []}
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
            paginationBtns={quotes?.payload.meta.links}
            currPageNo={pageNo}
            lastPageNo={quotes?.payload.meta.last_page}
            startItemNo={quoteItemStartNo}
            endItemNo={quoteItemEndNo}
            setPageNo={setPageNo}
            isFetching={isFetching}
          />
        </div>

        <CustomSheet
          isOpen={filerOpen}
          toggleIsOpen={toggleFilterOpen}
          withClearOption
        >
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
        </CustomSheet>
      </div>

      {/* Dialog to choose between track from scratch or with preset */}
      <CustomDialog
        dialogOpen={quoteDialogOpen}
        toggleDialogOpen={toggleQuoteDialogOpen}
        header="Create a New Quote"
        headerCls={cn(`border-0!`)}
      >
        <div className="flex flex-col gap-6 py-5 mt-6 max-w-125!">
          <span className="text-sm text-placeholder-text px-5 min-h-8.5">
            {" "}
            {
              "Choose how you'd like to begin. You can start fresh and build your quote step by step, or save time by using one of your preset quote templates."
            }{" "}
          </span>

          <div className="flex gap-4 justify-center">
            <div
              className="bg-custom-dialog-primary flex flex-col items-center min-w-55 gap-4 rounded-lg py-4 cursor-pointer"
              onClick={() => navigate(`/quotes/manage-quotes/`)}
            >
              <img src={assets.pencilFilledIcon} className="w-8 h-8" />
              <span> {"Start from Scratch"} </span>
            </div>

            <div
              className="bg-custom-dialog-primary flex flex-col items-center min-w-55 rounded-lg gap-4 py-4 cursor-pointer"
              onClick={() => togglePresetSelectionOpen((curr) => !curr)}
            >
              <img src={assets.thunderBoltIcon} className="w-8 h-8" />
              <span> {"Use Preset Quote"} </span>
            </div>
          </div>
        </div>
      </CustomDialog>

      {/* Preset Quote Selection Table */}
      <CustomDialog
        dialogOpen={presetSelectionOpen}
        toggleDialogOpen={togglePresetSelectionOpen}
        header="Select Preset Quote"
        withFooter
        footerBtnLabel="Continue"
        footerBtnAction={() => {
          navigate(`/quotes/manage-quotes/`);
        }}
      >
        <div className="lg:min-w-250 flex flex-col gap-4.5 mt-6 max-h-120 overflow-y-auto">
          <div className="px-5">
            <SearchInputGruop
              searchTerm={presetSearchTerm}
              setSearchTerm={setPresetSearchTerm}
              searchPlaceHolder="Search preset quotes"
            />
          </div>
          <CustomDataTable
            columns={presetQuotesColumns}
            data={presetQuoteData}
            showPaginated
            globalFilterTerm={debouncedPresetSearchTerm}
          />
        </div>
      </CustomDialog>
    </React.Fragment>
  );
}
