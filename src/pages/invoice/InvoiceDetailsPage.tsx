import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { formatCurrency, saveToDevice } from "../../lib/utils/helper";
import { getInitials } from "@/lib/utils/helper";
import { formatDisplayDate } from "@/lib/utils/date";
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
import SubtotalBreakDown from "../../components/quotes/SubtotalBreakDown";
import { CustomInfoCard } from "../../components/quotes/CustomInfoCard";
import { StatusDropDown } from "../../components/quotes/StatusDropDown";
import { ClientDetailsPopup } from "../../components/clients/ClientDetailsPopup";
import {
  ShareOptions,
  ShareOptionType,
} from "../../components/common/ShareOptions";
import {
  InvoiceStatus,
  PaymentMethods,
  type ItemDetails,
} from "@/types/api.responses.type";
import MoreOptionsPopup from "@/components/clients/MoreOptionsPopup";
import DeleteDialog from "@/components/common/DeleteDialog";
import { toast } from "react-toastify";
import { Spinner } from "@/components/ui/spinner";
import { showErrorToast } from "@/api/axiosInstance";
import { FormLayout } from "@/components/common/FormLayout";
import useInvoiceDetails from "@/hooks/apis/invoices/useInvoiceDetails";
import useInvoiceMutations from "@/hooks/apis/invoices/useInvoiceMutations";
import useInvoiceList from "@/hooks/apis/invoices/useInvoiceList";
import useInvoicePdf from "@/hooks/apis/invoices/useInvoicePdf";
import { InvoiceDescriptionPage } from "./InvoiceDescriptionPage";
import InvoicePaymentsPage from "./InvoicePaymentsPage";
import { useAppSelector } from "@/redux/store";
import SubscriptionWarningModal from "@/components/common/SubscriptionWarningModal";
import { useSubtotalFields } from "@/context/SubtotalFieldsContext";
import useHasSubscription from "@/hooks/useHasSubscription";
import CustomDialog from "@/components/common/CustomDialog";
import { XIcon } from "lucide-react";

export function InvoiceDetailsPage() {
  const { setDiscount, setVat, setPaymentMethod } = useSubtotalFields();
  const { vat_settings } = useAppSelector((state) => state.appConfig);
  const user = useAppSelector((state) => state.user);
  const params = useParams() as { id: string };
  const navigate = useNavigate();
  const { invoiceDetails, isFetching, refetch } = useInvoiceDetails({
    id: params.id,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const deboucedFilter = useDebounce({ value: globalFilter, delay: 500 });
  const [activeTable, toggleActiveTable] = useState("summary");
  const [clientDetailOpen, toggleClientDetailOpen] = useState(false);
  const [shareBoxOpen, toggleShareBoxOpen] = useState(false);
  const [moreOptionsOpen, toggleMoreOptionsOpen] = useState(false);
  const [deleteDialogOpen, toggleDeleteDialogOpen] = useState(false);
  const [invoicePreviewOpen, toggleinvoicePreviewOpen] = useState(false);
  const [shareExportPopupOpen, toggleShareExportPopup] = useState(false);

  const { subsEndWarningOpen, setSubsEndWarningOpen, checkCanCreateRecord } =
    useHasSubscription();
  const [confirmPaymentModalOpen, setConfirmPaymentModalOpen] = useState(false);

  const {
    invoiceStatusMutation,
    invoiceDeleteMutation,
    sendInvoiceEmailMutation,
    downloadInvoicePdfMutation,
  } = useInvoiceMutations();

  const { invoiceList, isFetching: isInvoiceListFetching } = useInvoiceList({
    filters: { quote_id: invoiceDetails?.quote.id },
    enabled: invoiceDetails?.quote !== undefined,
  });

  const { invoicePdf, isFetching: isPreviewFetching } = useInvoicePdf({
    invoice_id: invoiceDetails?.id ?? 0,
    enabled: invoicePreviewOpen,
  });

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

  const handleInvoiceDownload = () => {
    downloadInvoicePdfMutation.mutate(params.id, {
      onSuccess: (response) => {
        saveToDevice(
          response,
          `Invoice - ${invoiceDetails?.invoice_number}.pdf`,
        );
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const btnConfigList: (CustomBtnProps | React.ReactNode)[] = [
    {
      leftIcon: assets.previewIcon,
      buttonLabel: "Preview",
      onClick: () => toggleinvoicePreviewOpen((curr) => !curr),
    },

    <MoreOptionsPopup
      withContactInfo={false}
      withCopyOption={false}
      isPopupOpen={moreOptionsOpen}
      togglePopupOpen={toggleMoreOptionsOpen}
      deleteAction={() => toggleDeleteDialogOpen((curr) => !curr)}
      editAction={() => {
        if (checkCanCreateRecord()) {
          navigate(`/invoices/manage-invoice/${params?.id}`);
        }
      }}
    >
      <span className="h-9 w-fit flex rounded-[7px] py-2 px-4 gap-2.75 items-center btn-auth">
        {"More Action"}
      </span>
    </MoreOptionsPopup>,

    <MoreOptionsPopup
      isPopupOpen={shareExportPopupOpen}
      togglePopupOpen={toggleShareExportPopup}
      withDelete={false}
      withEdit={false}
      withDownload
      withShare={invoiceDetails?.status !== InvoiceStatus.paid}
      shareAction={() => toggleShareBoxOpen(true)}
      downloadAction={handleInvoiceDownload}
    >
      <span className="h-9 w-fit flex rounded-[7px] py-2 px-4 gap-2.75 items-center btn-auth">
        {downloadInvoicePdfMutation.isPending ? (
          <div className="flex justify-center items-center">
            {" "}
            <Spinner className="text-white " />{" "}
          </div>
        ) : (
          "Share & Export"
        )}
      </span>
    </MoreOptionsPopup>,
  ];

  const toggleGroupConfig: CustomToggleGroupProps["toggleConfig"] = useMemo(
    () => [
      { btnId: "summary", btnLabel: "Summary" },
      { btnId: "description", btnLabel: "Description" },
      { btnId: "payments", btnLabel: "Payments" },
    ],
    [],
  );

  const handleInvoiceDelete = () => {
    invoiceDeleteMutation.mutate(params.id, {
      onSuccess: (response) => {
        toggleDeleteDialogOpen(false);
        toast.success(response.message);
        navigate(`/invoices`);
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const nextStatusRef = useRef<InvoiceStatus | undefined>(undefined);

  const updateStatus = () => {
    if (!nextStatusRef.current) {
      toast.error(`No status selected to update`);
      return;
    }
    invoiceStatusMutation.mutate(
      {
        status: nextStatusRef.current,
        invoice_id: params.id,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          setConfirmPaymentModalOpen(false);
          refetch();
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  const handleStatusUpdate = (status: InvoiceStatus) => {
    setConfirmPaymentModalOpen(true);
    nextStatusRef.current = status;
  };

  const handleInvoiceEmail = () => {
    sendInvoiceEmailMutation.mutate(params.id, {
      onSuccess: (response) => {
        toast.success(response.message);
        toggleShareBoxOpen(false);
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  useEffect(() => {
    if (invoiceDetails?.quote.vat_setting_id) {
      setVat(
        vat_settings.find(
          (vatConfig) =>
            vatConfig.id === Number(invoiceDetails.quote.vat_setting_id),
        ),
      );
    } else {
      setVat(undefined);
    }
    if (invoiceDetails?.quote.discount?.amount) {
      setDiscount(Number(invoiceDetails.quote.discount.amount));
    } else {
      setDiscount(undefined);
    }

    if (invoiceDetails?.payment_method) {
      setPaymentMethod(invoiceDetails.payment_method);
    } else {
      setPaymentMethod(
        user.stripe_account_status === "active"
          ? PaymentMethods.stripe
          : PaymentMethods.cash,
      );
    }
  }, [invoiceDetails]);

  return (
    <React.Fragment>
      <div>
        <HeaderBreadCrumb pageName="Invoice Detail" />
        <div className="flex flex-col gap-6 px-6 pt-6 pb-8.5">
          <CustomHeader
            header={invoiceDetails?.title ?? ""}
            headerInfo={invoiceDetails?.invoice_number}
            btnConfigList={btnConfigList}
          />

          <CustomToggleGroup
            toggleConfig={toggleGroupConfig}
            activeId={activeTable}
            toggleActive={toggleActiveTable}
          />

          {isFetching ? (
            <div className="page-loading-overlay">
              <Spinner className="text-brand-dark size-8" />
            </div>
          ) : (
            <>
              {activeTable === "summary" && (
                <div className="flex gap-6 flex-col lg:flex-row">
                  {/* Items Table */}
                  <div className="table-theme! overflow-hidden grow">
                    <CustomDataTable
                      columns={itemColumns}
                      data={invoiceDetails?.items ?? []}
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
                          items={invoiceDetails?.items ?? []}
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
                            {formatDisplayDate(
                              invoiceDetails?.invoice_date ?? "",
                            )}{" "}
                          </span>
                        </div>

                        <div>
                          <span className="text-sm"> Expiry Date </span>
                          <span className="text-placeholder-text">
                            {" "}
                            {formatDisplayDate(
                              invoiceDetails?.due_date ?? "",
                            )}{" "}
                          </span>
                        </div>

                        <div>
                          <span className="text-sm"> Status </span>
                          <StatusDropDown
                            currStatus={invoiceDetails?.status}
                            statusSelectAction={(status) =>
                              handleStatusUpdate(status as InvoiceStatus)
                            }
                            statusEnum={
                              invoiceDetails?.status === InvoiceStatus.paid
                                ? {}
                                : { paid: "paid" }
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
                              invoiceDetails?.client?.name ?? "Unknown Client",
                            )}{" "}
                          </span>
                        </div>
                        <div className="flex flex-col justify-between items-center">
                          <span className="font-medium text-base self-start">
                            {" "}
                            {invoiceDetails?.client?.name ??
                              "Unknown Client"}{" "}
                          </span>
                          <span className="text-placeholder-text text-sm self-start">
                            {" "}
                            {invoiceDetails?.client?.company_name ?? ""}{" "}
                          </span>
                        </div>
                      </div>
                    </CustomInfoCard>

                    {/* Invoice info card — kept as-is (uses dummyData invoiceData) */}
                    <CustomInfoCard header="Invoices">
                      <div className="flex flex-col gap-3 max-h-125 overflow-y-auto">
                        {isInvoiceListFetching ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <Spinner className="text-brand-dark w-1/12 h-1/12" />
                          </div>
                        ) : (
                          invoiceList.map((invoice) => (
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
                                  {formatCurrency(invoice.total_due)}{" "}
                                </span>
                              </div>
                              <div className="bg-table-head min-h-6 rounded-sm px-2.5 flex items-center font-medium text-xs">
                                {invoice.status}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CustomInfoCard>
                  </div>
                </div>
              )}

              {activeTable === "description" && (
                <InvoiceDescriptionPage invoice={invoiceDetails} />
              )}
              {activeTable === "payments" && (
                <InvoicePaymentsPage invoice={invoiceDetails} />
              )}
            </>
          )}

          <ClientDetailsPopup
            isOpen={clientDetailOpen}
            toggleOpen={toggleClientDetailOpen}
            currClient={invoiceDetails?.client}
          />

          <ShareOptions
            isOpen={shareBoxOpen}
            toggleIsOpen={toggleShareBoxOpen}
            clientEmail={invoiceDetails?.client?.email ?? ""}
            sendEmailAction={handleInvoiceEmail}
            isEmailSending={sendInvoiceEmailMutation.isPending}
            shareLink={invoiceDetails?.route_url}
            downloadLink={`${invoiceDetails?.url}?download=1`}
            title={`Invoice - ${invoiceDetails?.invoice_number}`}
            type={ShareOptionType.invoice}
          />
        </div>
        <DeleteDialog
          isOpen={deleteDialogOpen}
          toggleOpen={toggleDeleteDialogOpen}
          deleteAction={handleInvoiceDelete}
          isPending={invoiceDeleteMutation.isPending}
        />

        <FormLayout
          isFormOpen={invoicePreviewOpen}
          formCloseAction={() => toggleinvoicePreviewOpen(false)}
          formHeading="Preview"
          withSubmitBtn={false}
        >
          <div className="min-h-[80vh] min-w-[30vw] flex justify-center pb-5">
            {isPreviewFetching || !invoicePdf ? (
              <div className="self-center">
                {" "}
                <Spinner className="text-brand-dark h-full w-full" />{" "}
              </div>
            ) : (
              <iframe
                srcDoc={`${invoicePdf}`}
                className="w-full border-0 p-0"
              />
            )}
          </div>
        </FormLayout>
      </div>

      <SubscriptionWarningModal
        isOpen={subsEndWarningOpen}
        toggleOpen={setSubsEndWarningOpen}
        action={() => navigate(`/subscribe-plan`)}
      />

      {/* status update confirmation dialog */}
      <CustomDialog
        dialogOpen={confirmPaymentModalOpen}
        toggleDialogOpen={setConfirmPaymentModalOpen}
        withHeader={false}
        withFooter
        showFooterSeparator={false}
        overlayClassName="bg-black/50"
        footerRightNode={
          <CustomBtn
            buttonLabel="Cancel"
            className="grow bg-dialog-cancel-btn-bg hover:bg-dialog-cancel-btn-bg text-warning-dialog-cancel-text"
            onClick={() => setConfirmPaymentModalOpen(false)}
          />
        }
        footerBtnLabel="Confirm"
        footerBtnAction={updateStatus}
        footerBtnCls="grow"
        closeOnSubmit={false}
        isSubmitting={invoiceStatusMutation.isPending}
        contentCls=""
      >
        <div className="max-md:min-w-fit relative flex flex-col p-8 pb-0 gap-2 text-center text-wrap wrap-break-word max-w-[30vw]">
          <XIcon
            className="absolute top-2 right-2 text-muted hover:text-black-text"
            onClick={() => setConfirmPaymentModalOpen(false)}
          />
          <h2 className="md:text-2xl font-semibold">
            {" "}
            {`Are you sure you want to mark this invoice as paid?`}{" "}
          </h2>
          <span className="text-placeholder-text text-sm">
            {`Please confirm that you have received the payment from the client before marking it as paid.`}
          </span>
        </div>
      </CustomDialog>
    </React.Fragment>
  );
}
