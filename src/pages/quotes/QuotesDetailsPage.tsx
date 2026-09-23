import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { invoiceData } from "../../constants/dummyData";
import {
  PaymentMethods,
  QuoteStatus,
  type ItemDetails,
} from "@/types/api.responses.type";
import MoreOptionsPopup from "@/components/clients/MoreOptionsPopup";
import DeleteDialog from "@/components/common/DeleteDialog";
import { toast } from "react-toastify";
import useQuoteDetails from "@/hooks/apis/quotes/useQuoteDetails";
import { Spinner } from "@/components/ui/spinner";
import useQuotesMutations from "@/hooks/apis/quotes/useQuotesMutations";
import { showErrorToast } from "@/api/axiosInstance";
import { updateQuote as updateQuoteRedux } from "@/redux/slices/quotes.slice";
import useQuotePreview from "@/hooks/apis/quotes/useQuotePreview";
import { FormLayout } from "@/components/common/FormLayout";
import useSendEmail from "@/hooks/apis/quotes/useSendEmail";

export function QuotesDetailsPage() {
  const params = useParams() as { id: string };
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { quote, isFetching, refetch } = useQuoteDetails({
    quote_id: params.id,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const deboucedFilter = useDebounce({ value: globalFilter, delay: 500 });
  const [activeTable, toggleActiveTable] = useState("summary");
  const [clientDetailOpen, toggleClientDetailOpen] = useState(false);
  const [shareBoxOpen, toggleShareBoxOpen] = useState(false);
  const [moreOptionsOpen, toggleMoreOptionsOpen] = useState(false);
  const [deleteDialogOpen, toggleDeleteDialogOpen] = useState(false);
  const [quotePreviewOpen, toggleQuotePreviewOpen] = useState(false);
  const [sendEmail, toggleSendEmail] = useState(false);

  const { quoteDuplicateMutation, quoteDeleteMutation, statusUpdateMutation } =
    useQuotesMutations();

  const { data, isSending } = useSendEmail({
    quote_id: quote?.id ?? "",
    enabled: sendEmail,
  });

  useEffect(() => {
    if (isSending) {
      toggleSendEmail(false);
    } else {
      if (data) {
        toast.success(data.message);
      }
    }
  }, [isSending]);

  const { previewHtml, isFetching: isPreviewFetching } = useQuotePreview({
    quote_id: params.id,
    enabled: quotePreviewOpen,
  });

  // ── Items table columns ─────────────────────────────────────────────────────
  const itemColumns: ColumnDef<TableFeatures, ItemDetails>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "ITEM NAME",
        enableSorting: false,
      },
      {
        accessorKey: "category_name",
        header: "CATEGORY",
        enableSorting: false,
      },
      {
        accessorKey: "subcategory_name",
        header: "SUBCATEGORY",
        enableSorting: false,
      },
      {
        accessorKey: "quantity",
        header: "QUANTITY",
        enableSorting: false,
      },
      {
        accessorKey: "price",
        header: "PRICE/UNIT",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableSorting: false,
      },
      {
        accessorKey: "cost",
        header: () => <span className="whitespace-nowrap">UNIT COST</span>,
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableSorting: false,
      },
      {
        id: "total",
        header: "TOTAL",
        cell: (info) => {
          const { price, quantity } = info.row.original;
          return formatCurrency(price * quantity);
        },
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
      onClick: () => toggleQuotePreviewOpen((curr) => !curr),
    },

    <MoreOptionsPopup
      withContactInfo={false}
      withCopyOption
      isPopupOpen={moreOptionsOpen}
      togglePopupOpen={toggleMoreOptionsOpen}
      deleteAction={() => toggleDeleteDialogOpen((curr) => !curr)}
      editAction={() => navigate(`/quotes/manage-quotes/${quote?.id}`)}
      copyAction={() => {
        quoteDuplicateMutation.mutate(quote?.id ?? "", {
          onSuccess: (response) => {
            toast.success(response.message);
            navigate(`/quotes`);
          },
          onError: (error) => {
            showErrorToast(error);
          },
        });
      }}
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

  const toggleGroupConfig: CustomToggleGroupProps["toggleConfig"] = useMemo(
    () => [
      { btnId: "summary", btnLabel: "Summary" },
      { btnId: "description", btnLabel: "Description" },
      { btnId: "section", btnLabel: "Section" },
    ],
    [],
  );

  const handleQuoteDelete = () => {
    quoteDeleteMutation.mutate(quote?.id ?? "", {
      onSuccess: (response) => {
        toast.success(response.message);
        navigate(`/quotes`);
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const handleStatusUpdate = (status: QuoteStatus) => {
    statusUpdateMutation.mutate(
      {
        quote_id: quote?.id ?? "",
        status,
      },
      {
        onSuccess: (response) => {
          if (!response.result) {
            toast.error(response.message);
          } else {
            toast.success(response.message);
            refetch();
          }
        },

        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  useEffect(() => {
    if (quote) {
      dispatch(updateQuoteRedux(quote));
    }
  }, [quote]);

  return (
    <React.Fragment>
      <div>
        <HeaderBreadCrumb pageName="Quote Detail" />
        <div className="flex flex-col gap-6 px-6 pt-6 pb-8.5">
          <CustomHeader
            header={quote?.title ?? ""}
            headerInfo={quote?.id.toString()}
            btnConfigList={btnConfigList}
          />

          <CustomToggleGroup
            toggleConfig={toggleGroupConfig}
            activeId={activeTable}
            toggleActive={toggleActiveTable}
          />

          {isFetching ? (
            <div className="w-full h-full flex items-center justify-center">
              <Spinner className="w-1/10 h-1/10" />
            </div>
          ) : (
            <>
              {activeTable === "summary" && (
                <div className="flex gap-6">
                  {/* Items Table */}
                  <div className="table-theme! overflow-hidden grow">
                    <CustomDataTable
                      columns={itemColumns}
                      data={quote?.items ?? []}
                      globalFilterTerm={deboucedFilter}
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
                          taxPercentage={quote?.financial_summary.tax}
                          discountPercentage={quote?.financial_summary.discount}
                          reqDeposite={
                            quote?.deposit_amount
                              ? quote?.deposit_amount
                              : undefined
                          }
                          paymentMethod={
                            user.stripe_connected
                              ? PaymentMethods.stripe
                              : PaymentMethods.cash
                          }
                          items={quote?.items ?? []}
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
                            {formatDisplayDate(quote?.quote_date ?? "")}{" "}
                          </span>
                        </div>

                        <div>
                          <span className="text-sm"> Expiry Date </span>
                          <span className="text-placeholder-text">
                            {" "}
                            {formatDisplayDate(quote?.expiry_date ?? "")}{" "}
                          </span>
                        </div>

                        <div>
                          <span className="text-sm"> Status </span>
                          <StatusDropDown
                            currStatus={quote?.status}
                            statusSelectAction={(status) =>
                              handleStatusUpdate(status)
                            }
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
                            {getInitials(
                              quote?.client?.name ?? "Unknown Client",
                            )}{" "}
                          </span>
                        </div>
                        <div className="flex flex-col justify-between items-center">
                          <span className="font-medium text-base">
                            {" "}
                            {quote?.client?.name ?? "Unknown Client"}{" "}
                          </span>
                          <span className="text-placeholder-text text-sm">
                            {" "}
                            {quote?.client?.company_name ?? ""}{" "}
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
                <QuoteDescriptionPage quote={quote} />
              )}
              {activeTable === "section" && <QuoteSectionPage />}
            </>
          )}

          <ClientDetailsPopup
            isOpen={clientDetailOpen}
            toggleOpen={toggleClientDetailOpen}
            currClient={quote?.client}
          />

          <ShareOptions
            isOpen={shareBoxOpen}
            toggleIsOpen={toggleShareBoxOpen}
            clientEmail={quote?.client?.email ?? ""}
            sendEmailAction={() => toggleSendEmail((curr) => !curr)}
            isEmailSending={isSending}
          />
        </div>
        <DeleteDialog
          isOpen={deleteDialogOpen}
          toggleOpen={toggleDeleteDialogOpen}
          deleteAction={handleQuoteDelete}
          isPending={quoteDeleteMutation.isPending}
        />

        <FormLayout
          isFormOpen={quotePreviewOpen}
          formCloseAction={() => toggleQuotePreviewOpen(false)}
          formHeading="Preview"
          withSubmitBtn={false}
        >
          <div className="min-h-[80vh] min-w-[30vw] flex justify-center pb-5">
            {isPreviewFetching ? (
              <div className="self-center">
                {" "}
                <Spinner className="text-brand-dark h-full w-full" />{" "}
              </div>
            ) : (
              <iframe
                srcDoc={`${previewHtml}`}
                className="w-full border-0 p-0"
              />
            )}
          </div>
        </FormLayout>
      </div>
    </React.Fragment>
  );
}
