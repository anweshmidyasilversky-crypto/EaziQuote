import { showErrorToast } from "@/api/axiosInstance";
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
import DeleteDialog from "@/components/common/DeleteDialog";
import FilterBtn from "@/components/common/FilterBtn";
import {
  RenderMultiSelectCheckbox,
  type RenderMultiSelectCheckboxProps,
} from "@/components/common/RenderMultiSelectCheckbox";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import StatusBadge from "@/components/common/StatusBadge";
import WarningDialog from "@/components/common/WarningDialog";
import useInvoiceList from "@/hooks/apis/invoices/useInvoiceList";
import useInvoiceMutations from "@/hooks/apis/invoices/useInvoiceMutations";
import { dateToDdMonYyyy, formatCurrency } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { type PageFilters } from "@/types/api.requests.type";
import { InvoiceStatus, type Invoice } from "@/types/api.responses.type";
import {
  SettingsPaymentPageReason,
  type SettingsLocationProps,
} from "@/types/common.types";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function InvoiceIndexPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const [filterSheetOpen, toggleFilterSheetOpen] = useState(false);
  const [filters, selectFilters] = useState<string[]>([]);
  const selectedFilters = useRef<PageFilters | undefined>(undefined);
  const [dateRange, setDateRage] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const [deleteModalOpen, toggleDeleteModalOpen] = useState(false);
  const [addBankDetailsDialog, setAddBankDetailsDialog] = useState(false);
  const [addSignatureWarningOpen, setAddSignatureWarningOpen] = useState(false);
  const [subsEndWarningOpen, setSubsEndWarningOpen] = useState(false);
  const {
    invoiceList,
    InvoiceSummary,
    isFetching,
    paginationMeta,
    setPageNo,
    searchTerm,
    setSearchTerm,
    refetch,
  } = useInvoiceList({ filters: selectedFilters.current });

  const { invoiceDeleteMutation } = useInvoiceMutations();
  const targetInvoiceId = useRef<number | undefined>(undefined);

  const btnConfig: CustomHeaderProps["btnConfigList"] = [
    {
      buttonLabel: "Invoice",
      leftIcon: assets.plusIcon,
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
        navigate(`/invoices/manage-invoice`);
      },
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
        return <ClientNameBadge name={clientName} withName={true} textWrap />;
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
        const { id, is_editable } = info.row.original;
        return (
          <CustomActionGroup
            openFn={() => navigate(`/invoices/${id}`)}
            editFn={() => navigate(`/invoices/manage-invoice/${id}`)}
            withEdit={is_editable}
            withDelete={is_editable}
            deleteFn={() => {
              targetInvoiceId.current = id;
              toggleDeleteModalOpen(true);
            }}
          />
        );
      },
    },
  ];

  const handleDelete = () => {
    if (!targetInvoiceId.current) {
      toast.error(`No invoice selected`);
      return;
    }
    invoiceDeleteMutation.mutate(targetInvoiceId.current, {
      onSuccess: (response) => {
        toast.success(response.message);
        toggleDeleteModalOpen(false);
        refetch();
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  return (
    <div className="p-5 h-full flex flex-col gap-6">
      <>
        <div>
          <CustomHeader
            header="Invoices"
            headerInfo="Manage all your invoices in one place"
            btnConfigList={btnConfig}
          />
        </div>

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

        <DeleteDialog
          isOpen={deleteModalOpen}
          toggleOpen={toggleDeleteModalOpen}
          deleteAction={handleDelete}
          isPending={invoiceDeleteMutation.isPending}
        />
      </>

      <WarningDialog
        open={addBankDetailsDialog}
        toggleOpen={setAddBankDetailsDialog}
        warningHeader="Complete Your Setup"
        warningContent="Add your bank details and signature to ensure your quotes look professional and include payment information."
        acceptBtnLabel="Complete Setup"
        acceptAction={() => navigate(`/settings/payments-and-invoicing`)}
        withCancelBtn={false}
      />

      <WarningDialog
        open={addSignatureWarningOpen}
        toggleOpen={setAddSignatureWarningOpen}
        warningHeader="Add Your Signature"
        warningContent="Adding a signature helps build trust and makes your quote feel complete and professional."
        withCancelBtn={false}
        acceptBtnLabel="Add Signature"
        acceptAction={() =>
          navigate(`/settings/payments-and-invoicing`, {
            state: {
              reason: SettingsPaymentPageReason.addSignature,
            } as SettingsLocationProps,
          })
        }
      />

      <WarningDialog
        open={subsEndWarningOpen}
        toggleOpen={setSubsEndWarningOpen}
        warningHeader="Subscription Required"
        warningContent="To continue using EaziQuote, please activate or renew your subscription."
        acceptBtnLabel="Activate Subscription"
        acceptAction={() => navigate(`/subscribe-plan`)}
        withCancelBtn={false}
        warningImgElement={
          <div className="relative flex items-center justify-center">
            <img src={assets.polygonGradient} className="h-20 aspect-auto" />
            <img
              src={assets.subsCriptionWhiteIcon}
              className="h-7.5 aspect-auto z-10 absolute"
            />
          </div>
        }
      />
    </div>
  );
}

export default InvoiceIndexPage;
