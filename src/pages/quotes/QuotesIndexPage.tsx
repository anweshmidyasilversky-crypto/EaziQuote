import {
  filterFn_includesString,
  type ColumnDef,
  type TableFeatures,
} from "@tanstack/react-table";
import { assets } from "../../assets/icons";
import {
  ActivitySummary,
  type ActivitySummaryProps,
} from "../../components/clients/ActivitySummary";
import { type CustomBtnProps } from "../../components/common/CustomBtn";
import { useMemo, useRef, useState } from "react";
import { formatCurrency } from "../../lib/utils/helper";
import { formatDisplayDate } from "@/lib/utils/date";
import { CustomActionGroup } from "../../components/common/CustomActionGroup";
import StatusBadge from "../../components/common/StatusBadge";
import { CustomDataTable } from "../../components/common/CustomTable";
import { ClientNameBadge } from "../../components/common/ClientNameBadge";
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
} from "../../components/common/DateRangePicker";
import { CustomHeader } from "../../components/common/CustomHeader";
import { useNavigate } from "react-router";
import React from "react";
import type { Quote, QuoteStatus } from "@/types/api.responses.type";
import type { PageFilters } from "@/types/api.requests.type";
import useQuoteList from "@/hooks/apis/quotes/useQuoteList";
import { useAppSelector } from "@/redux/store";
import DeleteDialog from "@/components/common/DeleteDialog";
import useQuotesMutations from "@/hooks/apis/quotes/useQuotesMutations";
import { toast } from "react-toastify";
import { showErrorToast } from "@/api/axiosInstance";
import {
  SettingsPaymentPageReason,
  type SettingsLocationProps,
} from "@/types/common.types";
import BankDetailsWarningModal from "@/components/common/BankDetailsWarningModal";
import SignatureWarningModal from "@/components/common/SignatureWarningModal";
import SubscriptionWarningModal from "@/components/common/SubscriptionWarningModal";
import QuoteCreateOptionsModal from "@/components/common/QuoteCreateOptionsModal";

export function QuotesIndexPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const [filerOpen, toggleFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const [filters, setFilters] = useState<string[]>([]);
  const pageFilters = useRef<PageFilters>({});
  const [deleteModalOpen, toggleDeleteModal] = useState(false);
  const [addBankDetailsDialog, setAddBankDetailsDialog] = useState(false);
  const [addSignatureWarningOpen, setAddSignatureWarningOpen] = useState(false);
  const [subsEndWarningOpen, setSubsEndWarningOpen] = useState(false);
  const targetQuoteId = useRef<number | undefined>(undefined);
  const [quoteCreateOptionsOpen, setQuoteCreateOptionsOpen] =
    useState<boolean>(false);

  const {
    quoteList,
    quoteSummary,
    isFetching: isQuoteListFetching,
    searchTerm: quoteSearchTerm,
    setSearchTerm: setQuoteSearchTerm,
    setPageNo,
    paginationMeta: quotePaginationMeta,
    refetch: refetchQuoteList,
  } = useQuoteList({
    filters: pageFilters.current,
  });

  const { quoteDeleteMutation } = useQuotesMutations();

  const summary: ActivitySummaryProps["summaryConfig"] = useMemo(() => {
    return [
      {
        summaryTitle: "Total Quotes",
        summary: quoteSummary?.total_count,
        summaryIcon: assets.invoiceColored,
      },
      {
        summaryTitle: "Accepted",
        summary: quoteSummary?.accepted_count,
        summaryIcon: assets.greenTickIcon,
      },
      {
        summaryTitle: "Pending",
        summary: quoteSummary?.pending_count,
        summaryIcon: assets.orangeClockIcon,
      },
      {
        summaryTitle: "Expired",
        summary: quoteSummary?.expired_count,
        summaryIcon: assets.OrangeHourGlassIcon,
      },
    ];
  }, [quoteList]);

  const quoteColumns: ColumnDef<TableFeatures, Quote>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "TITLE",
        enableSorting: false,
        filterFn: filterFn_includesString,
      },
      {
        accessorKey: "reference_number",
        header: "QUOTE",
        enableSorting: false,
        filterFn: filterFn_includesString,
      },
      {
        accessorKey: "name",
        header: "CLIENT",
        cell: (info) => {
          const client = info.getValue<string>();
          return <ClientNameBadge name={client} textWrap />;
        },
        enableSorting: false,
        filterFn: filterFn_includesString,
      },
      {
        accessorKey: "price",
        header: "AMOUNT",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableGlobalFilters: false,
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: (info) => {
          const status = info.getValue<QuoteStatus>();
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
        accessorKey: "expiry_date",
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
              editFn={() => {
                if (!(user.is_trial_period || user.is_subscription_active)) {
                  setSubsEndWarningOpen(true);
                  return;
                }
                navigate(`/quotes/manage-quotes/${quote.id}`);
              }}
              withEdit={row.original.is_editable}
              withDelete={row.original.is_editable}
              deleteFn={() => {
                targetQuoteId.current = quote.id;
                toggleDeleteModal((curr) => !curr);
              }}
            />
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
      onClick: () => {
        if (!user.hasBankAccountDetailAdded) {
          setAddBankDetailsDialog(true);
          return;
        }
        if (!user.hasSignatureAdded) {
          setAddSignatureWarningOpen(true);
          return;
        }
        if (!(user.is_trial_period || user.is_subscription_active)) {
          setSubsEndWarningOpen(true);
          return;
        }
        setQuoteCreateOptionsOpen(true);
      },
    },
  ];

  const handleQuoteDelete = () => {
    if (targetQuoteId.current) {
      quoteDeleteMutation.mutate(targetQuoteId.current, {
        onSuccess: (response) => {
          toast.success(response.message);
          toggleDeleteModal(false);
          refetchQuoteList();
        },
        onError: (error) => {
          showErrorToast(error);
        },
      });
    } else {
      toast.error(`No Quote Selected to delete`);
    }
  };

  return (
    <React.Fragment>
      <div className="p-5 pb-7.5 flex flex-col gap-6">
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
            data={quoteList}
            tableOptionsLeft={
              <SearchInputGruop
                searchTerm={quoteSearchTerm}
                setSearchTerm={setQuoteSearchTerm}
                searchPlaceHolder="Search quotes & clients"
              />
            }
            tableOptionsRight={
              <FilterBtn toggleFilterSheetOpen={toggleFilterOpen} />
            }
            showPaginated={true}
            paginationBtns={quotePaginationMeta?.links}
            setPageNo={setPageNo}
            isFetching={isQuoteListFetching}
            paginationMeta={quotePaginationMeta}
          />
        </div>

        <CustomSheet
          isOpen={filerOpen}
          toggleIsOpen={toggleFilterOpen}
          withClearOption
          submitFn={() => {
            pageFilters.current = {
              start_date: dateRange.startDate,
              end_date: dateRange.endDate,
              status: filters,
            };
          }}
          clearFn={() => {
            setDateRange({
              startDate: undefined,
              endDate: undefined,
            });
            setFilters([]);
            pageFilters.current = {};
          }}
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

      <QuoteCreateOptionsModal
        isOpen={quoteCreateOptionsOpen}
        toggleOpen={setQuoteCreateOptionsOpen}
      />

      <DeleteDialog
        isOpen={deleteModalOpen}
        toggleOpen={toggleDeleteModal}
        deleteAction={handleQuoteDelete}
        isPending={quoteDeleteMutation.isPending}
      />

      <BankDetailsWarningModal
        isOpen={addBankDetailsDialog}
        toggleOpen={setAddBankDetailsDialog}
        action={() => navigate(`/settings/payments-and-invoicing`)}
      />

      <SignatureWarningModal
        isOpen={addSignatureWarningOpen}
        toggleOpen={setAddSignatureWarningOpen}
        action={() =>
          navigate(`/settings/payments-and-invoicing`, {
            state: {
              reason: SettingsPaymentPageReason.addSignature,
            } as SettingsLocationProps,
          })
        }
      />

      <SubscriptionWarningModal
        isOpen={subsEndWarningOpen}
        toggleOpen={setSubsEndWarningOpen}
        action={() => navigate(`/subscribe-plan`)}
      />
    </React.Fragment>
  );
}
