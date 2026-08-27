import { useNavigate, useParams } from "react-router";
import { assets } from "../../assets/icons";
import {
  ActivitySummary,
  type ActivitySummaryProps,
} from "../../components/clients/ActivitySummary";
import {
  ClientActivityStatus,
  mockClientActivity,
  PaymentActivityStatus,
  paymentData,
  type ClientActivity,
  type ClientDataWithFilters,
  type PaymentData,
} from "../../constants/dummyData";
import {
  filterFn_includesString,
  type ColumnDef,
  type ColumnFiltersState,
  type TableFeatures,
} from "@tanstack/react-table";
import StatusBadge from "../../components/common/StatusBadge";
import { CustomActionGroup } from "../../components/common/CustomActionGroup";
import { useEffect, useMemo, useState } from "react";
import { CustomDataTable } from "../../components/common/CustomTable";
import { CustomBtn } from "../../components/common/CustomBtn";
import { useDebounce } from "../../hooks/debounce.hook";
import { Separator } from "../../components/ui/separator";
import MoreOptionsPopup from "../../components/clients/MoreOptionsPopup";
import type { ClientEditPayload } from "../../types/clientEdit.payload.type";
import { formatCurrency, getClient, getInitials } from "../../lib/utils";
import { ClientDetailsPopup } from "../../components/clients/ClientDetailsPopup";
import type { DefaultValues } from "react-hook-form";
import { useAppSelector } from "../../redux/store";
import { ClientForm } from "../../components/clients/ClientForm";
import SearchInputGruop from "../../components/common/SearchInputGruop";
import FilterBtn from "../../components/common/FilterBtn";
import {
  RenderMultiSelectCheckbox,
  type CheckboxConfig,
} from "../../components/common/RenderMultiSelectCheckbox";
import { TableFilterSheet } from "../../components/common/TableFilterSheet";
import {
  DateRangePicker,
  type DateRange,
} from "../../components/common/DateRangePicket";
import { HeaderBreadCrumb } from "../../components/common/CustomBreadCrumb";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "../../components/common/CustomToggleGroup";

export function ClientDetailsPage() {
  const navigate = useNavigate();
  const param = useParams<{ id: string }>();
  const user = useAppSelector((state) => state.user);
  const [clientCredential, setclientCredential] = useState(
    getClient(param.id as string) ?? (getClient("1") as ClientDataWithFilters),
  );
  const [currTable, toggleCurrTable] = useState<string>("activity");
  const [searchTearm, setSearchTerm] = useState<string>("");
  const debouncedVal = useDebounce({ value: searchTearm, delay: 500 });
  const [shownMoreOptions, toggleMoreOptions] = useState<boolean>(false);
  const [editPopupOpen, toggleEditPopupOpen] = useState<boolean>(false);
  const [contactInfoOpen, toggleContactInfoOpen] = useState<boolean>(false);
  const [tableData, setTableData] = useState<ClientActivity[] | PaymentData[]>(
    mockClientActivity,
  );
  const [filterOpen, toggleFilterOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const [filters, setFilters] = useState<string[]>([]);

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
        id: "overdue",
        label: "Overdue",
        value: "overdue",
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
        id: "completed",
        label: "Completed",
        value: "completed",
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
  useEffect(() => {
    setTableData(currTable === "activity" ? mockClientActivity : paymentData);
  }, [currTable]);

  const localFilters: ColumnFiltersState = useMemo(
    () => [
      {
        id: "title",
        value: debouncedVal,
      },
    ],
    [debouncedVal],
  );

  let initial = "AC";
  if (clientCredential) {
    initial = getInitials(clientCredential.client);
  }

  const activityTableColums: ColumnDef<TableFeatures, ClientActivity>[] =
    useMemo(
      () => [
        {
          accessorKey: "title",
          header: "TITLE",
          enableSorting: false,
          filterFn: filterFn_includesString,
        },
        {
          accessorKey: "quoteInvoice",
          header: "QUOTE/INVOICE",
          enableSorting: false,
        },
        {
          accessorKey: "amount",
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
        },
        {
          accessorKey: "creationDate",
          header: "CREATION DATE",
          enableSorting: false,
        },
        {
          accessorKey: "expiryDueDate",
          header: "EXPIRY/DUE DATE",
          enableSorting: false,
        },
        {
          id: "actions",
          header: "ACTION",
          cell: ({ row }) => {
            const activity = row.original;

            return (
              <CustomActionGroup
                openFn={() => navigate(`/quotes/${activity.quoteInvoice}`)}
              />
            );
          },
          enableSorting: false,
        },
      ],
      [],
    );

  const paymentColumns: ColumnDef<TableFeatures, PaymentData>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableSorting: false,
      },
      {
        accessorKey: "creationDate",
        header: "DATE",
        enableSorting: false,
      },
      {
        accessorKey: "quoteInvoice",
        header: "TYPE",
        enableSorting: false,
      },
      {
        accessorKey: "amount",
        header: "AMOUNT",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableSorting: false,
      },
      {
        accessorKey: "allocated",
        header: "ALLOCATED",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableSorting: false,
      },
      {
        accessorKey: "credit",
        header: "CREDIT",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableSorting: false,
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: (info) => {
          const status = info.getValue<PaymentActivityStatus>();

          return <StatusBadge status={status} />;
        },
        enableSorting: false,
      },
      {
        accessorKey: "method",
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
              paymentPending={payment.status === PaymentActivityStatus.Pending}
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
      summary: 20,
    },
    {
      summaryTitle: "quotes accepted",
      summaryIcon: assets.greenTickIcon,
      summary: 16,
    },
    {
      summaryTitle: "total invoices",
      summaryIcon: assets.invoiceColored,
      summary: 12,
    },
    {
      summaryTitle: "outstanding balance",
      summaryIcon: assets.redPoundIcon,
      summary: "£2000",
    },
    {
      summaryTitle: "available credit",
      summaryIcon: assets.greenPoundIcon,
      summary: "£5000",
    },
  ];

  const updateClient = (data: ClientEditPayload) => {
    const { name: client, companyName: company } = data;
    setclientCredential({
      ...clientCredential,
      ...data,
      client: client as string,
      company: company as string,
    });
    toggleEditPopupOpen(false);
  };

  const clientEditDefaultValues: DefaultValues<ClientEditPayload> = {
    name: clientCredential.client,
    companyName: clientCredential.company,
    phone: clientCredential.phone,
    email: clientCredential.email,
    street: user.street,
    city: user.city,
    postCode: user.postCode,
    country: user.country,
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
                  {clientCredential?.client ?? "Alexander Christopher"}{" "}
                </span>
                <span className="text-[14px] text-placeholder-text text-nowrap">
                  {" "}
                  {clientCredential?.company ?? "Greek Builders"}{" "}
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
                data={tableData as ClientActivity[]}
                localFilters={localFilters}
                showPaginated={true}
                tableOptionsLeft={SearchInputGruop({
                  searchTerm: searchTearm,
                  setSearchTerm: setSearchTerm,
                  searchPlaceHolder: "Search quotes & invoices",
                })}
                tableOptionsRight={FilterBtn({
                  toggleFilterSheetOpen: toggleFilterOpen,
                })}
              />
            </>
          )}

          {!isActivityTable && (
            <CustomDataTable
              columns={paymentColumns}
              data={tableData as PaymentData[]}
              showPaginated={true}
            />
          )}
        </div>
      </div>

      <ClientForm
        isFormOpen={editPopupOpen}
        mode="updation"
        clientEditFn={updateClient}
        defaultValues={clientEditDefaultValues}
        toggleFormOpen={toggleEditPopupOpen}
      />

      <ClientDetailsPopup
        isOpen={contactInfoOpen}
        toggleOpen={toggleContactInfoOpen}
        currClient={clientCredential}
      />

      <TableFilterSheet isOpen={filterOpen} toggleIsOpen={toggleFilterOpen}>
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
