import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import {
  itemData as mockItemData,
  type QuoteData,
  type ItemData,
  invoiceData,
} from "../../constants/dummyData";
import { useMemo, useState } from "react";
import {
  formatCurrency,
  getClient,
  getInitials,
  getQuoteFromId,
} from "../../lib/utils";
import { HeaderBreadCrumb } from "../../components/common/CustomBreadCrumb";
import { useParams } from "react-router";
import type { CustomBtnProps } from "../../components/common/CustomBtn";
import { assets } from "../../assets/icons";
import { CustomHeader } from "../../components/common/CustomHeader";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "../../components/common/CustomToggleGroup";
import { CustomDataTable } from "@/components/common/CustomTable";
import SearchInputGruop from "../../components/common/SearchInputGruop";
import { useDebounce } from "../../hooks/debounce.hook";
import { SubtotalBreakDown } from "../../components/quotes/SubtotalBreakDown";
import { CustomInfoCard } from "../../components/quotes/CustomInfoCard";
import { StatusDropDown } from "../../components/quotes/StatusDropDown";
import { ClientDetailsPopup } from "../../components/clients/ClientDetailsPopup";
import { ShareOptions } from "../../components/common/ShareOptions";
import { QuoteDescriptionPage } from "./QuoteDescriptionPage";

export function QuotesDetailsPage() {
  const params = useParams() as { id: string };
  const quote = getQuoteFromId(params.id);
  const invoices = quote.invoices ?? invoiceData;
  const itemColumns: ColumnDef<TableFeatures, ItemData>[] = useMemo(
    () => [
      {
        accessorKey: "itemName",
        header: "ITEM NAME",
        enableSorting: false,
      },
      {
        accessorKey: "category",
        header: "CATEGORY",
        enableSorting: false,
      },
      {
        accessorKey: "subcategory",
        header: "SUBCATEGORY",
        enableSorting: false,
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

  const [itemData, _] = useState(mockItemData);
  const [globalFilter, setGlobalFilter] = useState("");
  const deboucedFilter = useDebounce({ value: globalFilter, delay: 500 });
  const [activeTable, toggleActiveTable] = useState("summary");
  const [quoteCurrStatus, toggleQuoteCurrStatus] = useState<
    QuoteData["status"]
  >(quote.status);
  const [clientDetailOpen, toggleClientDetailOpen] = useState(false);
  const [shareBoxOpen, toggleShareBoxOpen] = useState(false);

  const btnConfigList: CustomBtnProps[] = [
    {
      leftIcon: assets.plusIcon,
      buttonLabel: "Invoice",
    },
    {
      leftIcon: assets.previewIcon,
      buttonLabel: "Preview",
    },
    {
      buttonLabel: "More Actions",
    },
    {
      buttonLabel: "Share & Export",
      onClick: () => toggleShareBoxOpen((curr) => !curr),
    },
  ];

  const toggleGroupConfig: CustomToggleGroupProps["toggleConfig"] = [
    {
      btnId: "summary",
      btnLabel: "Summary",
    },
    {
      btnId: "description",
      btnLabel: "Description",
    },
    {
      btnId: "section",
      btnLabel: "Section",
    },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div>
      <HeaderBreadCrumb pageName="Quote Detail" />
      <div className="flex flex-col gap-6 px-6 pt-6 pb-8.5">
        <CustomHeader
          header={quote.title}
          headerInfo={quote.id}
          btnConfigList={btnConfigList}
        />

        <CustomToggleGroup
          toggleConfig={toggleGroupConfig}
          activeId={activeTable}
          toggleActive={toggleActiveTable}
        />

        {activeTable === "summary" && (
          <div className="flex gap-6">
            {/* Render Table */}
            <div className="table-theme! overflow-hidden grow">
              <CustomDataTable
                columns={itemColumns}
                data={itemData}
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
              <div className="px-5">
                <div className="dashed-y-separators" />
              </div>

              <div className="w-full flex justify-end">
                <div className="max-w-75">
                  <SubtotalBreakDown
                    quote={quote}
                    marginPercentage={50}
                    taxPercentage={18}
                    discountPercentage={10}
                    reqDeposite={1500}
                    paymentMethod={quote.paymentMethod}
                    itemDetails={itemData}
                  />
                </div>
              </div>
            </div>

            {/* Info cards */}
            <div className="flex flex-col gap-6">
              <CustomInfoCard header="Basic Information">
                <div className="flex flex-col gap-6 [&_div]:flex [&_div]:justify-between">
                  <div>
                    <span className="text-sm"> Created on </span>
                    <span className="text-placeholder-text">
                      {" "}
                      {formatDate(new Date(quote.creationDate))}{" "}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm"> Expiry Date </span>
                    <span className="text-placeholder-text">
                      {" "}
                      {formatDate(new Date(quote.expiryDate))}{" "}
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

              {/* Client info */}
              <CustomInfoCard
                header="Client Details"
                headerLink="View Info"
                linkAction={() => toggleClientDetailOpen((curr) => !curr)}
              >
                <div className="flex gap-4 min-h-12">
                  {/* Initials */}
                  <div className="bg-transparent-royal-blue rounded-lg flex items-center justify-center min-w-12">
                    <span className="text-brand-dark min-h-5.5 font-medium text-lg">
                      {" "}
                      {getInitials(quote.client)}{" "}
                    </span>
                  </div>
                  {/* name & brand */}
                  <div className="flex flex-col justify-between items-center">
                    <span className="font-medium text-base">
                      {" "}
                      {quote.client}{" "}
                    </span>
                    <span className="text-placeholder-text text-sm">
                      {" "}
                      {quote.companyName ?? "Smith & Co Builders"}{" "}
                    </span>
                  </div>
                </div>
              </CustomInfoCard>

              {/* Invoice info card */}
              <CustomInfoCard header="Invoices">
                <div className="flex flex-col gap-3 max-h-125 overflow-y-auto">
                  {invoices.map((invoice) => (
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

        {activeTable === "description" && <QuoteDescriptionPage />}
      </div>

      <ClientDetailsPopup
        isOpen={clientDetailOpen}
        toggleOpen={toggleClientDetailOpen}
        currClient={{ ...getClient(""), client: quote.client }}
      />

      <ShareOptions
        isOpen={shareBoxOpen}
        toggleIsOpen={toggleShareBoxOpen}
        clientEmail={getClient("").email}
      />
    </div>
  );
}
