import { useNavigate, useParams } from "react-router";
import { assets } from "../../assets/icons";
import {
  ActivitySummary,
  type ActivitySummaryProps,
} from "../../components/clients/ActivitySummary";
import {
  ClientActivityStatus,
  PaymentActivityStatus,
} from "../../constants/dummyData";
import {
  filterFn_includesString,
  filterFn_inDateRange,
  type ColumnDef,
  type ColumnFiltersState,
  type TableFeatures,
} from "@tanstack/react-table";
import StatusBadge from "../../components/common/StatusBadge";
import { CustomActionGroup } from "../../components/common/CustomActionGroup";
import { useEffect, useMemo, useRef, useState } from "react";
import { CustomDataTable } from "../../components/common/CustomTable";
import { CustomBtn } from "../../components/common/CustomBtn";
import { useDebounce } from "../../hooks/useDebounce";
import { Separator } from "../../components/ui/separator";
import MoreOptionsPopup from "../../components/clients/MoreOptionsPopup";
import type { ClientEditPayload } from "../../types/clientEdit.payload.type";
import {
  formatCurrency,
  formatDisplayDate,
  getInitials,
} from "../../lib/utils";
import { ClientDetailsPopup } from "../../components/clients/ClientDetailsPopup";
import type { DefaultValues } from "react-hook-form";
import { ClientForm } from "../../components/clients/ClientForm";
import SearchInputGruop from "../../components/common/SearchInputGruop";
import FilterBtn from "../../components/common/FilterBtn";
import {
  RenderMultiSelectCheckbox,
  type CheckboxConfig,
} from "../../components/common/RenderMultiSelectCheckbox";
import { CustomSheet } from "../../components/common/CustomSheet";
import {
  DateRangePicker,
  type DateRange,
} from "../../components/common/DateRangePicket";
import { HeaderBreadCrumb } from "../../components/common/CustomBreadCrumb";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "../../components/common/CustomToggleGroup";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteClient,
  getClientDetails,
  updateClient,
} from "@/api/clients.api";
import {
  PaymentStatus,
  type InvoiceActivity,
  type Payment,
  type QuoteActivity,
} from "@/types/api.responses.type";
import type { UpdateClientApiPayload } from "@/types/api.requests.type";
import { showErrorToast } from "@/api/axiosInstance";
import { getPaymentListByClient } from "@/api/payments.api";
import DeleteDialog from "@/components/common/DeleteDialog";

export function ClientDetailsPage() {
  const navigate = useNavigate();
  const param = useParams<{ id: string }>();

  const [currTable, toggleCurrTable] = useState<string>("activity");
  const [searchTearm, setSearchTerm] = useState<string>("");
  const debouncedVal = useDebounce({ value: searchTearm, delay: 500 });
  const [shownMoreOptions, toggleMoreOptions] = useState<boolean>(false);
  const [editPopupOpen, toggleEditPopupOpen] = useState<boolean>(false);
  const [contactInfoOpen, toggleContactInfoOpen] = useState<boolean>(false);
  const [filterOpen, toggleFilterOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });

  const [filters, setFilters] = useState<string[]>([]);
  const activityTableFilters = useRef<ColumnFiltersState>([]);
  const [pageNo, setPageNo] = useState(1);

  const [deleteModalOpen, toggleDeleteModalOpen] = useState(false);

  const {
    data: clientDetailsResponse,
    isFetching: isRecentActivityFetching,
    error: recentActivityError,
  } = useQuery({
    queryKey: ["clientDetails", param.id],
    queryFn: () => getClientDetails(param.id as string),
  });

  if (recentActivityError) {
    showErrorToast(recentActivityError);
  }

  const { mutateAsync: updateClientAsync } = useMutation({
    mutationKey: ["clientDetails", "update", param.id],
    mutationFn: (data: UpdateClientApiPayload) =>
      updateClient(param.id as string, data),
  });

  const client = clientDetailsResponse?.payload;

  const { mutateAsync: deleteClientAsync } = useMutation({
    mutationKey: ["clientDetails", "client", "delete"],
    mutationFn: () => deleteClient(param.id as string),
  });

  const {
    data: paymentListResponse,
    isFetching: isPaymentListFetching,
    error: PaymentsFetchError,
  } = useQuery({
    queryKey: ["clientDetails", "payments", param.id, pageNo],
    queryFn: () =>
      getPaymentListByClient(param.id as string, {
        page: pageNo,
      }),
  });
  if (PaymentsFetchError) {
    showErrorToast(PaymentsFetchError);
  }
  const paymentList = paymentListResponse?.payload.data;
  const paymentListStartNo = paymentListResponse
    ? (paymentListResponse.payload.meta.current_page - 1) *
        paymentListResponse.payload.meta.per_page +
      1
    : 0;
  const paymentListEndNo = paymentListResponse
    ? Math.min(
        paymentListStartNo + paymentListResponse.payload.meta.per_page - 1,
        paymentListStartNo + (paymentList?.length ?? 0) - 1,
      )
    : 0;

  useEffect(() => {
    setPageNo(1);
  }, [currTable]);

  {
    /* Checkbox config */
  }
  const checkboxConfig: CheckboxConfig = useMemo(
    () => [
      {
        id: "paid",
        label: "Paid",
        value: "paid",
      },
      {
        id: "due",
        label: "Due",
        value: "due",
      },
      {
        id: "pending",
        label: "Pending",
        value: "pending",
      },
      {
        id: "draft",
        label: "Draft",
        value: "draft",
      },
      {
        id: "sent",
        label: "Sent",
        value: "sent",
      },
      {
        id: "completed",
        label: "Completed",
        value: "completed",
      },
      {
        id: "approved",
        label: "Approved",
        value: "approved",
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

  {
    /* Toggle tables based on which data is shown */
  }

  let initial = "AC";
  if (client) {
    initial = getInitials(client.name);
  }

  const activityTableColums: ColumnDef<
    TableFeatures,
    QuoteActivity | InvoiceActivity
  >[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "TITLE",
        enableSorting: false,
        filterFn: filterFn_includesString,
      },
      {
        accessorKey: "reference_number",
        header: "QUOTE/INVOICE",
        enableSorting: false,
      },
      {
        accessorKey: "price",
        header: "AMOUNT",
        cell: (info) => formatCurrency(info.getValue<number>()),
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: (info) => {
          const status = info.getValue<ClientActivityStatus>();
          return <StatusBadge status={status} />;
        },
        enableSorting: false,
        filterFn: filterFn_includesString,
      },
      {
        accessorKey: "created_at",
        header: "CREATION DATE",
        enableSorting: false,
        cell: (info) => formatDisplayDate(info.getValue<string>()),
        filterFn: (row, _, filterVal: Date) => {
          return (
            formatDisplayDate(row.original.created_at) ===
            formatDisplayDate(filterVal.toDateString())
          );
        },
      },
      {
        accessorKey: "expiry_date",
        header: "EXPIRY/DUE DATE",
        enableSorting: false,
        filterFn: filterFn_inDateRange,
        cell: (info) => formatDisplayDate(info.getValue<string>()),
      },
      {
        id: "actions",
        header: "ACTION",
        cell: ({ row }) => {
          const activity = row.original;

          return (
            <div className="flex items-center">
              <CustomActionGroup
                openFn={() => navigate(`/quotes/${activity.id}`)}
                editFn={() => navigate(`/quotes/manage-quotes/${activity.id}`)}
                withEdit={activity.is_editable}
              />
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    [],
  );

  const paymentColumns: ColumnDef<TableFeatures, Payment>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableSorting: false,
      },
      {
        accessorKey: "payment_date",
        header: "DATE",
        enableSorting: false,
      },
      {
        accessorKey: "amount_type",
        header: "TYPE",
        enableSorting: false,
      },
      {
        accessorKey: "amount",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableSorting: false,
      },
      {
        accessorKey: "allocated",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableSorting: false,
      },
      {
        accessorKey: "credit",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableSorting: false,
      },
      {
        accessorKey: "status",
        cell: (info) => {
          const status = info.getValue<PaymentActivityStatus>();

          return <StatusBadge status={status} />;
        },
        enableSorting: false,
      },
      {
        accessorKey: "payment_method",
        header: "METHOD",
        enableSorting: false,
      },
      {
        id: "actions",
        header: "ACTION",
        cell: ({ row }) => {
          const payment = row.original;

          return (
            <CustomActionGroup
              paymentActionGroup={true}
              paymentPending={payment.status !== PaymentStatus.Received}
            />
          );
        },
        enableSorting: false,
      },
    ],
    [],
  );

  const clientActivitySummary: ActivitySummaryProps["summaryConfig"] = [
    {
      summaryTitle: "Total quotes",
      summaryIcon: assets.invoiceColored,
      summary: client?.total_quotes,
    },
    {
      summaryTitle: "quotes accepted",
      summaryIcon: assets.greenTickIcon,
      summary: client?.quote_accepted_count,
    },
    {
      summaryTitle: "total invoices",
      summaryIcon: assets.invoiceColored,
      summary: client?.total_invoices,
    },
    {
      summaryTitle: "outstanding balance",
      summaryIcon: assets.redPoundIcon,
      summary: formatCurrency(client?.total_invoices_amount ?? 0),
    },
    {
      summaryTitle: "available credit",
      summaryIcon: assets.greenPoundIcon,
      summary: formatCurrency(client?.available_credit ?? 0),
    },
  ];

  const handleClientEdit = async (data: ClientEditPayload) => {
    try {
      const response = await updateClientAsync({
        _method: "put",
        ...data,
        phone: data.phone,
        company_name: data.companyName,
        address: data.street,
        postcode: data.postCode,
      });
      toast.success(response.message);
    } catch (err) {
      throw err;
    }
  };

  const clientEditDefaultValues: DefaultValues<ClientEditPayload> = {
    name: client?.name,
    companyName: client?.company_name,
    phone: client?.phone?.slice(5).replaceAll(" ", ""),
    email: client?.email,
    street: client?.address,
    city: client?.city,
    postCode: client?.postcode,
    country: client?.country,
  };

  const isActivityTable = currTable === "activity";

  const toggleConfig: CustomToggleGroupProps["toggleConfig"] = [
    {
      btnId: "activity",
      btnLabel: "Reacent Activity",
    },
    {
      btnId: "payment",
      btnLabel: "Payment",
    },
  ];

  const handleClientDelete = async () => {
    try {
      const res = await deleteClientAsync();
      toast.success(res.message);
      navigate("/clients");
    } catch (err) {
      throw err;
    }
  };

  return (
    <div>
      {/* Heading and breadcrumb */}
      <HeaderBreadCrumb pageName="Client Details" />

      <div className="flex flex-col gap-6 p-6">
        {/* Client info & summary */}
        <div className="flex flex-col lg:flex-row gap-6 min-h-27.75">
          {/* Client info */}
          <div className="flex justify-between items-center p-6 gap-6 bg-white rounded-[10px]">
            <div className="flex gap-4">
              <div className="flex justify-center items-center rounded-full bg-transparent-liquid-lava min-h-15 min-w-15">
                <span className="min-h-7.25 lg:text-6 font-medium uppercase text-center">
                  {" "}
                  {initial}{" "}
                </span>
              </div>
              <div className="flex flex-1 flex-col items-center">
                <span className="font-semibold text-lg md:text-xl text-nowrap">
                  {" "}
                  {client?.name ?? "Alexander Christopher"}{" "}
                </span>
                <span className="text-[14px] text-placeholder-text text-nowrap">
                  {" "}
                  {client?.company_name ?? "Greek Builders"}{" "}
                </span>
              </div>
            </div>

            {/* More options */}
            <MoreOptionsPopup
              isPopupOpen={shownMoreOptions}
              togglePopupOpen={toggleMoreOptions}
              editAction={() => toggleEditPopupOpen((curr) => !curr)}
              contactInfoAction={() => toggleContactInfoOpen((curr) => !curr)}
              withContactInfo
              deleteAction={() => toggleDeleteModalOpen((curr) => !curr)}
            >
              <span
                className="flex items-center justify-center bg-[#F5F6FB] w-9 h-9 rounded-[10px] shrink-0 cursor-pointer"
                onClick={() => toggleMoreOptions((curr) => !curr)}
              >
                <img
                  src={assets.moreIcon}
                  alt="More options"
                  className="h-4 w-3 object-contain"
                />
              </span>
            </MoreOptionsPopup>
          </div>
          {/* Activity summary */}
          <ActivitySummary summaryConfig={clientActivitySummary} />
        </div>

        <CustomToggleGroup
          toggleConfig={toggleConfig}
          activeId={currTable}
          toggleActive={toggleCurrTable}
        />

        <div className="flex flex-col py-4.5 gap-4.5 bg-white rounded-[7px]">
          <div className="flex items-center justify-between px-5">
            <span className="font-medium text-xs md:text-[16px] min-h-4.75">
              {" "}
              {isActivityTable ? "Recent Activity" : "Payments"}{" "}
            </span>
            <div className="max-w-fit">
              <CustomBtn
                leftIcon={assets.plusIcon}
                buttonLabel={
                  isActivityTable ? "New Quote" : "Create Payment Record"
                }
              />
            </div>
          </div>

          <Separator className={`bg-separator`} />

          {isActivityTable && (
            <>
              <CustomDataTable
                columns={activityTableColums}
                data={client?.recent_activities ?? []}
                localFilters={[
                  {
                    id: "title",
                    value: debouncedVal,
                  },
                  ...activityTableFilters.current,
                ]}
                tableOptionsLeft={SearchInputGruop({
                  searchTerm: searchTearm,
                  setSearchTerm: setSearchTerm,
                  searchPlaceHolder: "Search quotes & invoices",
                })}
                tableOptionsRight={FilterBtn({
                  toggleFilterSheetOpen: toggleFilterOpen,
                })}
                isFetching={isRecentActivityFetching}
              />
            </>
          )}

          {!isActivityTable && (
            <CustomDataTable
              columns={paymentColumns}
              data={paymentList ?? []}
              isFetching={isPaymentListFetching}
              showPaginated={true}
              setPageNo={setPageNo}
              paginationBtns={paymentListResponse?.payload.meta.links}
              startItemNo={paymentListStartNo}
              endItemNo={paymentListEndNo}
            />
          )}
        </div>
      </div>

      <ClientForm
        isFormOpen={editPopupOpen}
        mode="updation"
        clientEditFn={handleClientEdit}
        defaultValues={clientEditDefaultValues}
        toggleFormOpen={toggleEditPopupOpen}
      />

      <ClientDetailsPopup
        isOpen={contactInfoOpen}
        toggleOpen={toggleContactInfoOpen}
        currClient={client}
      />

      <CustomSheet
        isOpen={filterOpen}
        toggleIsOpen={toggleFilterOpen}
        withClearOption
        submitFn={() => {
          activityTableFilters.current = [
            {
              id: "created_at",
              value: dateRange.startDate,
            },
            {
              id: "expiry_date",
              value: [dateRange.startDate, dateRange.endDate],
            },
            {
              id: "status",
              value: filters,
            },
          ];
        }}
        clearFn={() => {
          setFilters([]);
          activityTableFilters.current = [];
          setDateRange({
            startDate: undefined,
            endDate: undefined,
          });
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

      <DeleteDialog
        isOpen={deleteModalOpen}
        toggleOpen={toggleDeleteModalOpen}
        deleteAction={handleClientDelete}
      />
    </div>
  );
}
