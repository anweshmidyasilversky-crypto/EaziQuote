import { assets } from "@/assets/icons";
import {
  ActivitySummary,
  type ActivitySummaryProps,
} from "@/components/clients/ActivitySummary";
import { ClientNameBadge } from "@/components/common/ClientNameBadge";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import {
  CustomHeader,
  type CustomHeaderProps,
} from "@/components/common/CustomHeader";
import { CustomSheet } from "@/components/common/CustomSheet";
import { CustomDataTable } from "@/components/common/CustomTable";
import {
  DateRangePicker,
  type DateRange,
} from "@/components/common/DateRangePicker";
import FilterBtn from "@/components/common/FilterBtn";
import {
  RenderMultiSelectCheckbox,
  type RenderMultiSelectCheckboxProps,
} from "@/components/common/RenderMultiSelectCheckbox";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import StatusBadge from "@/components/common/StatusBadge";
import useInvoiceList from "@/hooks/apis/invoices/useInvoiceList";
import { dateToDdMonYyyy, formatCurrency } from "@/lib/utils";
import { type PageFilters } from "@/types/api.requests.type";
import { InvoiceStatus, type Invoice } from "@/types/api.responses.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";

function InvoiceIndexPage() {
  const navigate = useNavigate();
  const [filterSheetOpen, toggleFilterSheetOpen] = useState(false);
  const [filters, selectFilters] = useState<string[]>([]);
  const selectedFilters = useRef<PageFilters | undefined>(undefined);
  const [dateRange, setDateRage] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const {
    invoiceList,
    InvoiceSummary,
    isFetching,
    paginationMeta,
    setPageNo,
    searchTerm,
    setSearchTerm,
  } = useInvoiceList({ filters: selectedFilters.current });

  const btnConfig: CustomHeaderProps["btnConfigList"] = [
    {
      buttonLabel: "Invoice",
      leftIcon: assets.plusIcon,
    },
  ];

  const summaryConfig: ActivitySummaryProps["summaryConfig"] = [
    {
      summaryTitle: "total invoices",
      summaryIcon: assets.invoiceColored,
      summary: InvoiceSummary?.total_count,
    },
    {
      summaryTitle: "paid",
      summaryIcon: assets.greenTickIcon,
      summary: InvoiceSummary?.paid_count,
    },
    {
      summaryTitle: "outstanding",
      summaryIcon: assets.orangeClockIcon,
      summary: InvoiceSummary?.outstanding_count,
    },
    {
      summaryTitle: "overdue",
      summaryIcon: assets.OrangeHourGlassIcon,
      summary: InvoiceSummary?.overdue_count,
    },
  ];

  const checkBoxConfig: RenderMultiSelectCheckboxProps["checkboxconfig"] = [
    {
      id: "due",
      label: "Due",
      value: "due",
    },
    {
      id: "overdue",
      label: "Overdue",
      value: "overdue",
    },
    {
      id: "paid",
      label: "Paid",
      value: "paid",
    },
  ];

  const invoiceColumns: ColumnDef<TableFeatures, Invoice>[] = [
    {
      accessorKey: "title",
      header: "Invoice title",
      enableSorting: false,
    },
    {
      accessorKey: "reference_number",
      header: "Invoice",
      enableSorting: false,
    },
    {
      accessorKey: "quote_reference_number",
      header: "Quote",
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Client",
      enableSorting: false,
      cell: (info) => {
        const clientName = info.getValue<string>();
        return <ClientNameBadge name={clientName} withName={true} />;
      },
    },
    {
      accessorKey: "total_due",
      header: "Amount",
      enableSorting: false,
      cell: (info) => formatCurrency(info.getValue<number>()),
    },
    {
      accessorKey: "status",
      cell: (info) => {
        const status = info.getValue<InvoiceStatus>();
        return <StatusBadge status={status} />;
      },
      enableSorting: false,
    },
    {
      accessorKey: "created_at",
      header: "CREATION DATE",
      enableSorting: false,
      cell: (info) => dateToDdMonYyyy(info.getValue<string>()),
    },
    {
      accessorKey: "expiry_date",
      header: "DUE DATE",
      enableSorting: false,
      cell: (info) => dateToDdMonYyyy(info.getValue<string>()),
    },
    {
      id: "action",
      header: "Action",
      cell: (info) => {
        const { id } = info.row.original;
        return <CustomActionGroup openFn={() => navigate(`/invoices/${id}`)} />;
      },
    },
  ];

  return (
    <div className="p-5 h-full flex flex-col gap-6">
      <>
        <CustomHeader
          header="Invoices"
          headerInfo="Manage all your invoices in one place"
          btnConfigList={btnConfig}
        />

        <ActivitySummary summaryConfig={summaryConfig} />

        <div className="flex flex-col gap-5 bg-table pt-5 rounded-[10px]">
          <CustomDataTable
            columns={invoiceColumns}
            data={invoiceList}
            isFetching={isFetching}
            showPaginated
            paginationMeta={paginationMeta}
            paginationBtns={paginationMeta?.links}
            setPageNo={setPageNo}
            tableOptionsLeft={
              <SearchInputGruop
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceHolder="Search invoices & clients"
              />
            }
            tableOptionsRight={
              <FilterBtn toggleFilterSheetOpen={toggleFilterSheetOpen} />
            }
          />
        </div>

        <CustomSheet
          isOpen={filterSheetOpen}
          toggleIsOpen={toggleFilterSheetOpen}
          withClearOption={true}
          submitFn={() => {
            selectedFilters.current = {
              start_date: dateRange.startDate,
              end_date: dateRange.endDate,
            };
            if (filters.length >= 1) {
              selectedFilters.current = {
                ...selectedFilters.current,
                status: filters[0],
              };
            }
          }}
          clearFn={() => {
            selectFilters([]);
            setDateRage({
              startDate: undefined,
              endDate: undefined,
            });
            selectedFilters.current = undefined;
          }}
        >
          <div className="flex flex-col gap-6 p-6 [&_span]:font-medium [&_span]:uppercase [&_span]:text-placeholder-text">
            <div className="flex flex-col gap-4">
              <span> {"Date Range"} </span>
              <DateRangePicker
                dateRange={dateRange}
                setDateRange={setDateRage}
              />
            </div>

            <div className="flex flex-col">
              <span> {"Status"} </span>
              <RenderMultiSelectCheckbox
                checkboxconfig={checkBoxConfig}
                selectedFilters={filters}
                toggleSelectedFilters={selectFilters}
                type="single"
              />
            </div>
          </div>
        </CustomSheet>
      </>
    </div>
  );
}

export default InvoiceIndexPage;
