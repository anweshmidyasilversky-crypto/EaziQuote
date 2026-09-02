import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  formatCurrency,
  formatDisplayDate,
  getInitials,
} from "../../lib/utils";
import { HeaderBreadCrumb } from "../../components/common/CustomBreadCrumb";
import { useNavigate, useParams } from "react-router";
import {
  CustomBtn,
  type CustomBtnProps,
} from "../../components/common/CustomBtn";
import { assets } from "../../assets/icons";
import { CustomHeader } from "../../components/common/CustomHeader";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "../../components/common/CustomToggleGroup";
import { CustomDataTable } from "@/components/common/CustomTable";
import SearchInputGruop from "../../components/common/SearchInputGruop";
import { useDebounce } from "../../hooks/useDebounce";
import { SubtotalBreakDown } from "../../components/quotes/SubtotalBreakDown";
import { CustomInfoCard } from "../../components/quotes/CustomInfoCard";
import { StatusDropDown } from "../../components/quotes/StatusDropDown";
import { ClientDetailsPopup } from "../../components/clients/ClientDetailsPopup";
import { ShareOptions } from "../../components/common/ShareOptions";
import { QuoteDescriptionPage } from "./QuoteDescriptionPage";
import { QuoteSectionPage } from "./QuoteSectionPage";
import { useAppSelector } from "../../redux/store";
import type { QuoteLineItem } from "../../types/quoteLineItem.type";
import type { ClientDataWithFilters } from "../../constants/dummyData";
import { invoiceData, QuoteActivityStatus } from "../../constants/dummyData";
import { PaymentMethods } from "@/types/addDeposite.payload.type";
import MoreOptionsPopup from "@/components/clients/MoreOptionsPopup";
import DeleteDialog from "@/components/common/DeleteDialog";

export function QuotesDetailsPage() {
  const params = useParams() as { id: string };
  const navigate = useNavigate();
  // ── Read from Redux ─────────────────────────────────────────────────────────
  const quote = useAppSelector((state) =>
    state.quotes.find((q) => q.id === params.id),
  );

  const allClients = useAppSelector((state) => state.clients);

  // Fallback to first quote if ID not found (graceful degradation)
  const activeQuote = useAppSelector((state) => quote ?? state.quotes[0]);

  const [globalFilter, setGlobalFilter] = useState("");
  const deboucedFilter = useDebounce({ value: globalFilter, delay: 500 });
  const [activeTable, toggleActiveTable] = useState("summary");
  const [quoteCurrStatus, toggleQuoteCurrStatus] =
    useState<QuoteActivityStatus>(
      (activeQuote?.status ?? "Draft") as QuoteActivityStatus,
    );
  const [clientDetailOpen, toggleClientDetailOpen] = useState(false);
  const [shareBoxOpen, toggleShareBoxOpen] = useState(false);
  const [moreOptionsOpen, toggleMoreOptionsOpen] = useState(false);
  const [deleteDialogOpen, toggleDeleteDialogOpen] = useState(false);

  const client = allClients.find((c) => c.id === activeQuote?.clientId);

  // ── Items table columns ─────────────────────────────────────────────────────
  const itemColumns: ColumnDef<TableFeatures, QuoteLineItem>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "ITEM NAME",
        enableSorting: false,
      },
      {
        accessorKey: "catId",
        header: "CATEGORY",
        enableSorting: false,
        cell: (info) => {
          // Resolve category name from catId
          const catId = info.getValue<string>();
          return catId === "cat-materials" ? "Materials" : "Services";
        },
      },
      {
        accessorKey: "subCatId",
        header: "SUBCATEGORY",
        enableSorting: false,
        cell: (info) => {
          // Pretty-print subCatId (strip prefix)
          const raw = info.getValue<string>();
          return raw.replace(/^(sub-|svc-)/, "").replace(/-/g, " ");
        },
      },
      {
        accessorKey: "quantity",
        header: "QUANTITY",
        enableSorting: false,
      },
      {
        accessorKey: "pricePerUnit",
        header: "PRICE/UNIT",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableSorting: false,
      },
      {
        accessorKey: "unitCost",
        header: () => <span className="whitespace-nowrap">UNIT COST</span>,
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableSorting: false,
      },
      {
        accessorKey: "total",
        header: "TOTAL",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableSorting: false,
      },
    ],
    [],
  );

  const btnConfigList: (CustomBtnProps | React.ReactNode)[] = [
    {
      leftIcon: assets.plusIcon,
      buttonLabel: "Invoice",
    },
    {
      leftIcon: assets.previewIcon,
      buttonLabel: "Preview",
    },

    <MoreOptionsPopup
      withContactInfo={false}
      withCopyOption
      isPopupOpen={moreOptionsOpen}
      togglePopupOpen={toggleMoreOptionsOpen}
      deleteAction={() => toggleDeleteDialogOpen((curr) => !curr)}
      editAction={() =>
        navigate(`/quotes/manage-quotes/${params.id ?? "QT-2025-101"}`)
      }
    >
      <CustomBtn
        buttonLabel="More Actions"
        onClick={() => toggleMoreOptionsOpen((curr) => !curr)}
      />
    </MoreOptionsPopup>,

    {
      buttonLabel: "Share & Export",
      onClick: () => toggleShareBoxOpen((curr) => !curr),
    },
  ];

  const toggleGroupConfig: CustomToggleGroupProps["toggleConfig"] = [
    { btnId: "summary", btnLabel: "Summary" },
    { btnId: "description", btnLabel: "Description" },
    { btnId: "section", btnLabel: "Section" },
  ];

  // Build a ClientDataWithFilters-compatible object for the popup
  const clientDisplayData: ClientDataWithFilters = {
    id: client?.id ?? "",
    client: client?.name ?? "Unknown Client",
    company: client?.companyName ?? "",
    phone: client?.phone ?? "",
    email: client?.email ?? "",
    createdAt: client?.createdAt ?? new Date().toISOString(),
    activityCount: 0,
  };

  if (!activeQuote) {
    return <div className="p-6 text-placeholder-text">No quote found.</div>;
  }

  return (
    <>
      <div>
        <HeaderBreadCrumb pageName="Quote Detail" />
        <div className="flex flex-col gap-6 px-6 pt-6 pb-8.5">
          <CustomHeader
            header={activeQuote.title}
            headerInfo={activeQuote.id}
            btnConfigList={btnConfigList}
          />

          <CustomToggleGroup
            toggleConfig={toggleGroupConfig}
            activeId={activeTable}
            toggleActive={toggleActiveTable}
          />

          {activeTable === "summary" && (
            <div className="flex gap-6">
              {/* Items Table */}
              <div className="table-theme! overflow-hidden grow">
                <CustomDataTable
                  columns={itemColumns}
                  data={activeQuote.items}
                  globalFilterTerm={deboucedFilter}
                  showPaginated
                  tableOptionsLeft={
                    <div className="font-medium text-[16px] min-h-4.75 flex items-center">
                      {" "}
                      Items{" "}
                    </div>
                  }
                  tableOptionsRight={
                    <SearchInputGruop
                      searchTerm={globalFilter}
                      setSearchTerm={setGlobalFilter}
                      searchPlaceHolder="Search here"
                    />
                  }
                />

                {/* Subtotal Breakdown */}
                <div className="px-5">
                  <div className="dashed-y-separators" />
                </div>

                <div className="w-full flex justify-end">
                  <div className="max-w-75">
                    <SubtotalBreakDown
                      taxPercentage={18}
                      discountPercentage={10}
                      reqDeposite={1500}
                      paymentMethod={PaymentMethods.cash}
                      items={activeQuote.items}
                    />
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="flex flex-col gap-6">
                <CustomInfoCard header="Basic Information">
                  <div className="flex flex-col gap-6 [&_div]:flex [&_div]:justify-between">
                    <div>
                      <span className="text-sm"> Created on </span>
                      <span className="text-placeholder-text">
                        {" "}
                        {formatDisplayDate(activeQuote.quoteDate)}{" "}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm"> Expiry Date </span>
                      <span className="text-placeholder-text">
                        {" "}
                        {formatDisplayDate(activeQuote.expiryDate)}{" "}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm"> Status </span>
                      <StatusDropDown
                        currStatus={quoteCurrStatus}
                        toggleStatus={toggleQuoteCurrStatus}
                      />
                    </div>
                  </div>
                </CustomInfoCard>

                {/* Client Info */}
                <CustomInfoCard
                  header="Client Details"
                  headerLink="View Info"
                  linkAction={() => toggleClientDetailOpen((curr) => !curr)}
                >
                  <div className="flex gap-4 min-h-12">
                    <div className="bg-transparent-royal-blue rounded-lg flex items-center justify-center min-w-12">
                      <span className="text-brand-dark min-h-5.5 font-medium text-lg">
                        {" "}
                        {getInitials(client?.name ?? "Unknown Client")}{" "}
                      </span>
                    </div>
                    <div className="flex flex-col justify-between items-center">
                      <span className="font-medium text-base">
                        {" "}
                        {client?.name ?? "Unknown Client"}{" "}
                      </span>
                      <span className="text-placeholder-text text-sm">
                        {" "}
                        {client?.companyName ?? ""}{" "}
                      </span>
                    </div>
                  </div>
                </CustomInfoCard>

                {/* Invoice info card — kept as-is (uses dummyData invoiceData) */}
                <CustomInfoCard header="Invoices">
                  <div className="flex flex-col gap-3 max-h-125 overflow-y-auto">
                    {invoiceData.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="min-h-15.5 flex justify-between items-center border border-dashed border-separator px-4 py-3 rounded-[7px]"
                      >
                        <div className="flex flex-col justify-between gap-2">
                          <span className="font-medium text-xs">
                            {" "}
                            {invoice.id}{" "}
                          </span>
                          <span className="text-placeholder-text">
                            {" "}
                            {formatCurrency(invoice.total)}{" "}
                          </span>
                        </div>
                        <div className="bg-table-head min-h-6 rounded-sm px-2.5 flex items-center font-medium text-xs">
                          {invoice.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </CustomInfoCard>
              </div>
            </div>
          )}

          {activeTable === "description" && (
            <QuoteDescriptionPage quote={activeQuote} />
          )}
          {activeTable === "section" && <QuoteSectionPage />}
        </div>

        <ClientDetailsPopup
          isOpen={clientDetailOpen}
          toggleOpen={toggleClientDetailOpen}
          currClient={clientDisplayData}
        />

        <ShareOptions
          isOpen={shareBoxOpen}
          toggleIsOpen={toggleShareBoxOpen}
          clientEmail={client?.email ?? ""}
        />
      </div>

      <DeleteDialog
        isOpen={deleteDialogOpen}
        toggleOpen={toggleDeleteDialogOpen}
      />
    </>
  );
}
