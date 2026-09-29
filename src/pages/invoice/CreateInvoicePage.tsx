import React, { useEffect, useState } from "react";
import { HeaderBreadCrumb } from "../../components/common/CustomBreadCrumb";
import { CustomHeader } from "../../components/common/CustomHeader";
import type { CustomBtnProps } from "../../components/common/CustomBtn";
import { assets } from "../../assets/icons";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "../../components/common/CustomToggleGroup";
import QuoteSummaryForm from "../../components/quotes/QuoteSummaryForm";
import ItemSelectForm from "../../components/quotes/ItemSelectForm";
import { useNavigate, useParams } from "react-router";
import SectionSelectForm from "@/components/quotes/SectionSelectForm";
import useQuoteDetails from "@/hooks/apis/quotes/useQuoteDetails";
import { Spinner } from "@/components/ui/spinner";
import { persistor, useAppDispatch, useAppSelector } from "@/redux/store";
import {
  removeQuote,
  updateQuote as updateQuoteRedux,
} from "@/redux/slices/quotes.slice";
import useInvoiceDetails from "@/hooks/apis/invoices/useInvoiceDetails";
import InvoiceSummaryForm from "@/components/invoices/InvoiceSummaryForm";
import InvoiceItemSelectForm from "@/components/invoices/InvoiceItemSelectForm";

enum toggleId {
  Summary = "summary",
  Items = "items",
  Sections = "sections",
}

export function CreateInvoicePage() {
  const navigate = useNavigate();
  const [formCurrSection, changeFormCurrSection] = useState<string>(
    toggleId.Summary,
  );
  const params = useParams<{ id: string | undefined }>();

  const {
    invoiceDetails,
    isFetching: isInvoiceFetching,
    refetch,
  } = useInvoiceDetails({
    id: params.id ?? "",
    enabled: params.id !== undefined,
  });

  const btnConfigList: CustomBtnProps[] = [
    {
      buttonLabel: "Download",
      leftIcon: assets.plusIcon,
    },
    {
      buttonLabel: "share",
      leftIcon: assets.shareIconWhite,
      className: `bg-manage-quote-secondary hover:bg-manage-quote-secondary`,
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
      <HeaderBreadCrumb pageName={`${params.id ? `Edit` : `New`} Invoice`} />

      {isInvoiceFetching ? (
        <div className="flex w-full h-full items-center justify-center">
          <Spinner className="text-brand-dark w-1/10 h-1/10" />
        </div>
      ) : (
        <div className="p-5 flex flex-col gap-6">
          <CustomHeader
            header={`${params.id ? `Edit` : `New`} Invoice`}
            btnConfigList={btnConfigList}
          />

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
                    currInvoice={invoiceDetails}
                    submitAction={() => {
                      changeFormCurrSection(toggleId.Items);
                      refetch();
                    }}
                  />
                )}
                {formCurrSection === toggleId.Items && (
                  <InvoiceItemSelectForm currInvoice={invoiceDetails} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
