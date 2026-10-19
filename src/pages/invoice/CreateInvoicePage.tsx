import React, { useState } from "react";
import { HeaderBreadCrumb } from "../../components/common/CustomBreadCrumb";
import { CustomHeader } from "../../components/common/CustomHeader";
import type { CustomBtnProps } from "../../components/common/CustomBtn";
import { assets } from "../../assets/icons";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "../../components/common/CustomToggleGroup";
import { useLocation, useParams } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import useInvoiceDetails from "@/hooks/apis/invoices/useInvoiceDetails";
import InvoiceSummaryForm from "@/components/invoices/InvoiceSummaryForm";
import InvoiceItemSelectForm from "@/components/invoices/InvoiceItemSelectForm";
import useInvoiceMutations from "@/hooks/apis/invoices/useInvoiceMutations";
import { previewDateFormatter, saveToDevice } from "@/lib/utils";
import { showErrorToast } from "@/api/axiosInstance";
import { toast } from "react-toastify";
import {
  ShareOptions,
  ShareOptionType,
} from "@/components/common/ShareOptions";
import type { InvoiceCreateApiPayload } from "@/types/api.requests.type";
import { DocumentTemplate, type ItemDetails } from "@/types/api.responses.type";
import Preview, { type PreviewPropsSection } from "@/components/pdf/Preview";

enum toggleId {
  Summary = "summary",
  Items = "items",
}

export type CreateInvoicePageLocationProps = {
  quoteId?: number;
};

export function CreateInvoicePage() {
  const [formCurrSection, changeFormCurrSection] = useState<string>(
    toggleId.Summary,
  );
  const params = useParams<{ id: string | undefined }>();
  const location = useLocation();
  const { quoteId } = (location.state ?? {}) as CreateInvoicePageLocationProps;
  const [shareModalOpen, setShareModalOpen] = useState(false);

  {
    /* For preview section */
  }
  const [summaryPreview, setSummaryPreview] = useState<
    Partial<InvoiceCreateApiPayload>
  >({});
  const [previewItems, setPreviewItems] = useState<ItemDetails[]>([]);
  const [jobDescriptionPreview, setJobDescriptionPreview] = useState<
    string | undefined
  >(undefined);
  const [refNoPreview, setRefNoPreview] = useState<string | undefined>(
    undefined,
  );

  const {
    invoiceDetails,
    isFetching: isInvoiceFetching,
    refetch,
  } = useInvoiceDetails({
    id: params.id ?? "",
    enabled: params.id !== undefined,
    refetchOnFocus: false,
  });

  const { sendInvoiceEmailMutation, downloadInvoicePdfMutation } =
    useInvoiceMutations();

  const handleDownload = () => {
    if (!invoiceDetails) {
      return;
    }
    downloadInvoicePdfMutation.mutate(invoiceDetails.id, {
      onSuccess: (blob) => {
        saveToDevice(blob, `invoice - ${invoiceDetails.invoice_number}.pdf`);
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const handleEmailSend = () => {
    if (!invoiceDetails) {
      return;
    }
    sendInvoiceEmailMutation.mutate(invoiceDetails.id, {
      onSuccess: (response) => {
        toast.success(response.message);
        setShareModalOpen(false);
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const btnConfigList: CustomBtnProps[] = [
    {
      buttonLabel: "Download",
      leftIcon: downloadInvoicePdfMutation.isPending
        ? ""
        : assets.downloadIconWhite,
      onClick: handleDownload,
      isSubmitting: downloadInvoicePdfMutation.isPending,
      disabled: downloadInvoicePdfMutation.isPending,
    },
    {
      buttonLabel: "share",
      leftIcon: assets.shareIconWhite,
      className: `bg-manage-quote-secondary hover:bg-manage-quote-secondary`,
      onClick: () => setShareModalOpen(true),
    },
  ];

  const toggleConfig: CustomToggleGroupProps["toggleConfig"] = [
    {
      btnId: toggleId.Summary,
      btnLabel: "Summary",
    },
    {
      btnId: toggleId.Items,
      btnLabel: "Items",
      disabled: params.id === undefined,
    },
  ];

  return (
    <React.Fragment>
      <HeaderBreadCrumb
        pageName={`${params.id ? `Edit` : `New`} Invoice`}
        parentPagePath={location.pathname.split("/").toSpliced(-2).join("/")}
      />

      {isInvoiceFetching ? (
        <div className="page-loading-overlay">
          <Spinner className="text-brand-dark size-8" />
        </div>
      ) : (
        <div className="p-5 flex flex-col gap-6">
          <CustomHeader
            header={`${params.id ? `Edit` : `New`} Invoice`}
            btnConfigList={params.id ? btnConfigList : []}
          />

          <div className="form-with-preview-layout">
            <div className="flex gap-6 overflow-x-auto rounded-[7px]">
              <div className="bg-white rounded-[7px] grow">
                <div className="flex flex-col gap-5 py-5">
                  <CustomToggleGroup
                    toggleConfig={toggleConfig}
                    activeId={formCurrSection}
                    toggleActive={changeFormCurrSection}
                    className={`bg-transparent! text-black-text [&_button]:disabled:text-muted create-quote-toggle [&_.btnActive]:border-b [&_.btnActive]:border-brand-dark [&_.btnActive]:text-brand-dark [&_.btnActive]:bg-transparent [&_button]:max-w-22.75! px-2`}
                  />
                  {formCurrSection === toggleId.Summary && (
                    <InvoiceSummaryForm
                      mode={params.id ? "edit" : "create"}
                      currInvoice={params.id ? invoiceDetails : undefined}
                      submitAction={() => {
                        refetch();
                        changeFormCurrSection(toggleId.Items);
                      }}
                      prefillQuoteId={quoteId}
                      setSummaryPreview={setSummaryPreview}
                      setJobDescriptionPreview={setJobDescriptionPreview}
                      setRefNoPreview={setRefNoPreview}
                    />
                  )}
                  {formCurrSection === toggleId.Items && (
                    <InvoiceItemSelectForm
                      currInvoice={invoiceDetails}
                      setItemsPreview={setPreviewItems}
                    />
                  )}
                </div>
              </div>
            </div>
            <Preview
              invoiceId={invoiceDetails?.id}
              documentTemplate={
                invoiceDetails?.template ?? DocumentTemplate.classic
              }
              section={formCurrSection as PreviewPropsSection}
              quoteRefNo={refNoPreview}
              client={invoiceDetails?.client}
              issueDate={previewDateFormatter(
                new Date(summaryPreview.invoice_date ?? new Date()),
              )}
              dueDate={previewDateFormatter(
                new Date(summaryPreview.due_date ?? new Date()),
              )}
              showCompanyNumber={!summaryPreview.is_company_phone_number_show}
              items={previewItems}
              jobDescription={jobDescriptionPreview}
            />
          </div>
        </div>
      )}

      <ShareOptions
        isOpen={shareModalOpen}
        toggleIsOpen={setShareModalOpen}
        clientEmail={invoiceDetails?.client.email ?? ""}
        sendEmailAction={handleEmailSend}
        isEmailSending={sendInvoiceEmailMutation.isPending}
        shareLink={invoiceDetails?.route_url}
        downloadLink={`${invoiceDetails?.url}?download=1`}
        title={`Invoice - ${invoiceDetails?.invoice_number}`}
        type={ShareOptionType.invoice}
      />
    </React.Fragment>
  );
}
