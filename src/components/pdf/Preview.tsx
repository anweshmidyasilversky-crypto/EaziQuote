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
import { cn } from "@/lib/utils";
import { CustomBtn } from "../common/CustomBtn";
import ModernHeader from "./ModernHeader";
import ModernFooter from "./ModernFooter";
import ElegentHeaderSeparator from "./ElegentHeaderSeparator";
import ElegentFooter from "./ElegentFooter";
import ItemTableByDocumentCategory from "./ItemTableByDocumentCategory";

export type PreviewPropsSection = "summary" | "items" | "sections";

export type PreviewProps = {
  documentTemplate: DocumentTemplate;
  section: PreviewPropsSection;
  items?: ItemDetails[];
  client?: ClientDetails;
  sections?: QuoteSection[];
  quoteTitle?: string;
  quoteRefNo?: string;
  issueDate?: string;
  dueDate?: string;
  jobDescription?: string;
  showCompanyNumber?: boolean;
  categorisationMethod?: DocumentCategories;
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
  categorisationMethod = DocumentCategories.byItem,
}: PreviewProps) {
  const {
    company: {
      logo,
      name: companyName,
      phone_number: companyPhoneNo,
      email: companyMail,
      address: { address, city, postcode, country },
      brand_color,
    },
  } = useAppSelector((state) => state.user);
  const clientAddress = `${client?.address}, ${client?.city}, ${client?.postcode}, ${client?.country}`;

  const [templateSelectModalOpen, setTemplateSelectModalOpen] = useState(false);
  const [currTemplate, setCurrTemplate] =
    useState<DocumentTemplate>(documentTemplate);
  const [categorisedBy, setCategorisedBy] =
    useState<DocumentCategories>(categorisationMethod);

  return (
    <div className="h-fit rounded-[7px] bg-white p-4 dashboard-card-theme">
      <div className="flex justify-end pb-5">
        {section === "items" && (
          <select className="input-field">
            {Object.keys(DocumentCategories).map((catMetod) => {
              return (
                <option key={catMetod} value={catMetod}>
                  {catMetod}
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
              <section className="w-full grid grid-cols-[70%_30%] gap-2">
                <div className="flex gap-2 items-center ">
                  {section === "summary" && (
                    <>
                      <img
                        src={logo ?? assets.logo}
                        className="w-12 aspect-auto"
                      />
                      <span> {companyName} </span>
                    </>
                  )}
                  {section === "items" && (
                    <span style={{ color: brand_color }}>
                      {" "}
                      {`Items Summary`}{" "}
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
              <Separator className="bg-separator" />
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
            <div className="px-4">
              <ItemTableByDocumentCategory
                categorizationMethod={categorisedBy}
                items={items ?? []}
              />
            </div>
          )}
        </div>

        <div className="mt-auto w-full self-end">
          {currTemplate === DocumentTemplate.classic && (
            <ClassicBottom className="w-full" />
          )}
          {currTemplate === DocumentTemplate.modern && (
            <ModernFooter className="w-full" />
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
                      : ``,
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
