import {
  DocumentCategories,
  DocumentTemplate,
  type ClientDetails,
  type ItemDetails,
  type QuoteSection,
} from "@/types/api.responses.type";
import ClassicHeaderDecoration from "./ClassicHeaderDecoration";
import { useAppSelector } from "@/redux/store";
import { assets } from "@/assets/icons";
import { Separator } from "../ui/separator";
import ClassicBottom from "./ClassicBottom";
import { useState } from "react";
import CustomDialog from "../common/CustomDialog";
import { cn } from "@/lib/utils/helper";
import { CustomBtn } from "../common/CustomBtn";
import ModernHeader from "./ModernHeader";
import ModernFooter from "./ModernFooter";
import ElegentHeaderSeparator from "./ElegentHeaderSeparator";
import ElegentFooter from "./ElegentFooter";
import ItemTableByDocumentCategory from "./ItemTableByDocumentCategory";
import SubtotalBreakDown from "../quotes/SubtotalBreakDown";
import useQuotesMutations from "@/hooks/apis/quotes/useQuotesMutations";
import { toast } from "react-toastify";
import { showErrorToast } from "@/api/axiosInstance";
import useInvoiceMutations from "@/hooks/apis/invoices/useInvoiceMutations";

export type PreviewPropsSection = "summary" | "items" | "sections";

export type PreviewProps = {
  documentTemplate: DocumentTemplate;
  section: PreviewPropsSection;
  items?: ItemDetails[];
  client?: ClientDetails;
  quoteSections?: QuoteSection[];
  quoteTitle?: string;
  quoteRefNo?: string;
  issueDate?: string;
  dueDate?: string;
  jobDescription?: string;
  showCompanyNumber?: boolean;
  categorisationMethod?: keyof typeof DocumentCategories;
  quoteId?: number;
  invoiceId?: number;
};

function Preview({
  documentTemplate,
  showCompanyNumber = true,
  quoteTitle,
  quoteRefNo,
  client,
  issueDate,
  jobDescription,
  dueDate,
  section,
  items,
  categorisationMethod = "by-item",
  quoteSections,
  quoteId,
  invoiceId,
}: PreviewProps) {
  const { quoteUpdateMutation } = useQuotesMutations();
  const { invoiceUpdateMutation } = useInvoiceMutations();
  const {
    name,
    company: {
      logo,
      name: companyName,
      phone_number: companyPhoneNo,
      email: companyMail,
      address: { address, city, postcode, country },
      brand_color,
    },
  } = useAppSelector((state) => state.user);
  const {
    quote_invoice_settings: { terms_and_conditions, signature },
  } = useAppSelector((state) => state.appConfig);
  const clientAddress = `${client?.address}, ${client?.city}, ${client?.postcode}, ${client?.country}`;

  const [templateSelectModalOpen, setTemplateSelectModalOpen] = useState(false);
  const [currTemplate, setCurrTemplate] =
    useState<DocumentTemplate>(documentTemplate);
  const [categorisedBy, setCategorisedBy] =
    useState<keyof typeof DocumentCategories>(categorisationMethod);

  const setTemplate = () => {
    if (quoteId) {
      quoteUpdateMutation.mutate(
        {
          quote_id: quoteId,
          _method: "put",
          template: currTemplate,
        },
        {
          onSuccess: (response) => {
            toast.success(response.message);
            setTemplateSelectModalOpen(false);
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    } else if (invoiceId) {
      invoiceUpdateMutation.mutate(
        {
          invoice_id: invoiceId,
          _method: "put",
          template: currTemplate,
        },
        {
          onSuccess: (response) => {
            toast.success(response.message);
            setTemplateSelectModalOpen(false);
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    } else {
      setTemplateSelectModalOpen(false);
    }
  };

  const setCategorization = (method: keyof typeof DocumentCategories) => {
    if (quoteId) {
      quoteUpdateMutation.mutate(
        {
          quote_id: quoteId,
          _method: "put",
          categorised: method,
        },
        {
          onSuccess: (response) => {
            toast.success(response.message);
            setCategorisedBy(method);
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    } else if (invoiceId) {
      invoiceUpdateMutation.mutate(
        {
          invoice_id: invoiceId,
          _method: "put",
          categorised: method,
        },
        {
          onSuccess: (response) => {
            toast.success(response.message);
            setCategorisedBy(method);
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    } else {
      setCategorisedBy(method);
    }
  };

  return (
    <div className="h-fit rounded-[7px] bg-white p-4 dashboard-card-theme">
      <div className="flex pb-5 gap-2 items-center">
        <div className="bg-live-preview-badge py-2 px-3 rounded-[7px] flex gap-3 self-start min-h-9.5 items-center min-w-fit">
          <div className="w-3 h-3 shrink-0 bg-live-preview-bold border-2 border-live-preview-border bg-clip-padding rounded-full" />
          <span className="text-live-preview-bold font-medium text-[12px]">
            {" "}
            {`Live Preview`}{" "}
          </span>
        </div>
        <div className="flex justify-end gap-2 w-full">
          {section === "items" && (
            <select
              className="input-field btn-auth hover:bg-transparent active:bg-transparent text-black-text max-w-fit min-w-1/3 max-h-9.5 py-0!"
              onChange={(e) => {
                const val = e.currentTarget.value;
                setCategorization(val as keyof typeof DocumentCategories);
              }}
              disabled={
                quoteUpdateMutation.isPending || invoiceUpdateMutation.isPending
              }
            >
              {Object.keys(DocumentCategories).map((catMetod) => {
                return (
                  <option
                    key={catMetod}
                    value={catMetod}
                    selected={catMetod === categorisationMethod}
                  >
                    {
                      DocumentCategories[
                        catMetod as keyof typeof DocumentCategories
                      ]
                    }
                  </option>
                );
              })}
            </select>
          )}
          <CustomBtn
            buttonLabel="Templates"
            btncls="bg-transparent hover:bg-transparent border border-brand-dark text-black-text hover:text-black-text"
            onClick={() => setTemplateSelectModalOpen(true)}
          />
        </div>
      </div>
      <div className="relative min-h-screen flex flex-col rounded-sm border border-preview-border  overflow-hidden text-[14px]">
        <div className="flex flex-1 flex-col gap-6 overflow-hidden">
          <div className="relative">
            {/* Decoration */}
            {currTemplate === DocumentTemplate.classic && (
              <ClassicHeaderDecoration className="absolute top-0 right-0 h-25 w-30 aspect-auto z-0" />
            )}
            {currTemplate === DocumentTemplate.modern && (
              <ModernHeader className="absolute top-0 right-0 z-0 w-full h-full" />
            )}
            <div className="w-full pt-8 [&_span]:text-wrap [&_span]:wrap-anywhere flex flex-col gap-2 [&_span]:z-10 [&_img]:z-10 px-4">
              {/* Header sections */}
              <section className="w-full grid grid-cols-[70%_30%] gap-2 pb-4">
                <div className="flex gap-2 items-center ">
                  {section === "summary" && (
                    <>
                      {logo && (
                        <img
                          src={logo ?? assets.logo}
                          className="w-12 aspect-auto"
                        />
                      )}
                      <span> {companyName} </span>
                    </>
                  )}
                  {section === "items" && (
                    <span style={{ color: brand_color }}>
                      {" "}
                      {`Items Summary`}{" "}
                    </span>
                  )}
                  {section === "sections" && (
                    <span style={{ color: brand_color }}>
                      {`Quote Summary`}
                    </span>
                  )}
                </div>
              </section>
              <div />

              {section === "summary" && (
                <div className="grid grid-cols-[70%_30%] [&_span]:text-wrap [&_span]:wrap-anywhere">
                  <section className="flex flex-col gap-1">
                    {showCompanyNumber && (
                      <span>{`(+44) ${companyPhoneNo}`}</span>
                    )}
                    <span> {companyMail} </span>
                    <span>
                      {" "}
                      {`${address}, ${city}, ${postcode}, ${country}`}{" "}
                    </span>
                  </section>

                  <section className="flex flex-col gap-1 [&_span]:text-wrap [&_span]:wrap-anywhere [&_span]:self-end">
                    <span style={{ color: brand_color }}> {`Quote Ref:`} </span>
                    <span> {quoteRefNo} </span>
                    <span> {quoteTitle} </span>
                  </section>
                </div>
              )}
            </div>

            {currTemplate === DocumentTemplate.elegant ? (
              <ElegentHeaderSeparator className="w-full mt-4 h-4" />
            ) : (
              <Separator
                className={cn(
                  "bg-separator z-10 absolute",
                  currTemplate === DocumentTemplate.modern ? `hidden` : ``,
                )}
              />
            )}
          </div>

          {section === "summary" && (
            <>
              {client && (
                <div className="flex flex-col gap-1 px-4">
                  <span style={{ color: brand_color }}> {`Client`} </span>
                  <div className="grid grid-cols-2 [&_span]:text-wrap [&_span]:wrap-anywhere">
                    <section className="flex min-w-0 flex-col gap-1">
                      <span> {client?.name} </span>
                      <span>
                        {" "}
                        {`${client?.phone?.startsWith(`(+44)`) ? client?.phone : `(+44) ${client?.phone}`}`}{" "}
                      </span>
                      <span> {clientAddress} </span>
                    </section>

                    <section className="flex min-w-0 flex-col gap-1 [&_div]:self-end">
                      {documentTemplate === DocumentTemplate.modern && (
                        <div className="flex gap-2">
                          <span style={{ color: brand_color }}>
                            {" "}
                            {`Quote Ref:`}{" "}
                          </span>
                          <span> {quoteRefNo} </span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <span style={{ color: brand_color }}>
                          {" "}
                          {`Issue Date:`}{" "}
                        </span>
                        <span> {issueDate} </span>
                      </div>

                      <div className="flex gap-2">
                        <span style={{ color: brand_color }}>
                          {" "}
                          {`Due Date:`}{" "}
                        </span>
                        <span> {dueDate} </span>
                      </div>
                    </section>
                  </div>
                </div>
              )}
              {jobDescription && (
                <div className="flex flex-col gap-2 px-4">
                  <span style={{ color: brand_color }}>
                    {" "}
                    {`Job Description:`}{" "}
                  </span>
                  <span> {jobDescription} </span>
                </div>
              )}{" "}
            </>
          )}

          {section === "items" && (
            <div className="flex flex-col gap-4 px-4 mt-4">
              <ItemTableByDocumentCategory
                categorizationMethod={categorisedBy}
                items={items ?? []}
              />

              <div className="flex gap-10">
                <div className="flex flex-col gap-2">
                  <span style={{ color: brand_color }} className="font-bold">
                    {" "}
                    {`Terms and conditions`}{" "}
                  </span>
                  <span className="text-wrap wrap-break-word">
                    {" "}
                    {terms_and_conditions}{" "}
                  </span>
                </div>

                <SubtotalBreakDown items={items ?? []} isPreview />
              </div>
            </div>
          )}

          {section === "sections" && (
            <div className="flex flex-col gap-4 px-4">
              {quoteSections?.map((quoteSection, index) => {
                return (
                  <div key={quoteSection.id}>
                    <span style={{ color: brand_color }} className="font-bold">
                      {" "}
                      {`${index + 1}. ${quoteSection.title}`}{" "}
                    </span>
                    <div
                      dangerouslySetInnerHTML={{ __html: quoteSection.content }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-auto w-full self-end">
          {section === "items" && (
            <div className="flex flex-col pb-4">
              <div className="self-end flex flex-col items-center justify-center gap-1.5 px-4">
                <img
                  src={signature ?? ""}
                  alt="signature"
                  className="w-20 aspect-auto"
                />
                {/* <Separator className={`dashed-y-separators`} /> */}
                <span> {name} </span>
              </div>
            </div>
          )}
          {currTemplate === DocumentTemplate.classic && (
            <ClassicBottom className="w-full min-h-40" />
          )}
          {currTemplate === DocumentTemplate.modern && (
            <ModernFooter className="w-full min-h-10" />
          )}
          {currTemplate === DocumentTemplate.elegant && (
            <ElegentFooter className="w-full h-1.5" />
          )}
        </div>
      </div>

      <CustomDialog
        dialogOpen={templateSelectModalOpen}
        toggleDialogOpen={setTemplateSelectModalOpen}
        header="Templates"
        withFooter
        showFooterSeparator={false}
        footerCls="px-6"
        footerBtnCls="min-w-11"
        footerBtnLabel="Continue"
        closeOnSubmit={false}
        isSubmitting={
          quoteUpdateMutation.isPending || invoiceUpdateMutation.isPending
        }
        footerBtnAction={() => setTemplate()}
      >
        <div className="min-w-[70vw] max-h-[80vh] overflow-y-auto flex flex-col lg:flex-row gap-2 justify-center items-center pt-5 pb-2">
          {Object.keys(DocumentTemplate).map((template) => {
            let templateImg = assets.classicTemplate;
            if (template === DocumentTemplate.modern) {
              templateImg = assets.modernTemplate;
            } else if (template === DocumentTemplate.elegant) {
              templateImg = assets.elegentTemplate;
            }
            return (
              <div
                className="relative flex w-full max-w-75 shrink-0 cursor-pointer"
                onClick={() => setCurrTemplate(template as DocumentTemplate)}
              >
                <img
                  src={templateImg}
                  className={cn(
                    "w-full aspect-auto z-1",
                    template === currTemplate
                      ? `brightness-50 border-2 rounded-xl border-brand-dark`
                      : `hover:brightness-75`,
                  )}
                />
                <img
                  src={assets.selectedTickBlue}
                  className={cn(
                    `absolute top-1/2 left-1/2`,
                    template === currTemplate ? `z-10` : `z-0`,
                  )}
                />
              </div>
            );
          })}
        </div>
      </CustomDialog>
    </div>
  );
}

export default Preview;
