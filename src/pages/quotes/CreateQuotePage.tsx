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
import { useLocation, useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import SectionSelectForm from "@/components/quotes/SectionSelectForm";
import { useQuery } from "@tanstack/react-query";
import { getQuoteDetails } from "@/api/services/quotes.api";
import { showErrorToast } from "@/api/axiosInstance";
import useQuoteDetails from "@/hooks/apis/quotes/useQuoteDetails";
import { removeQuote, updateQuote } from "@/redux/slices/quotes.slice";
import type { QuoteDetails } from "@/types/api.responses.type";

enum toggleId {
  Summary = "summary",
  Items = "items",
  Sections = "sections",
}

export function CreateQuotePage() {
  const navigate = useNavigate();
  const [formCurrSection, changeFormCurrSection] = useState<string>(
    toggleId.Summary,
  );
  const params = useParams<{ id: string | undefined }>();
  let currQuote: QuoteDetails | undefined = useAppSelector(
    (state) => state.quote,
  );

  const dummyRefNo = `QT-${new Date().getFullYear()}-1`;
  const refNo =
    (currQuote?.reference_number ?? "").trim().length > 0
      ? (currQuote?.reference_number as string)
      : dummyRefNo;

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
      disabled: dummyRefNo === refNo,
    },
    {
      btnId: toggleId.Sections,
      btnLabel: "Sections",
      disabled: (currQuote?.items.length ?? 0) <= 0,
    },
  ];

  return (
    <React.Fragment>
      <HeaderBreadCrumb pageName="New Quote" />

      <div className="p-5 flex flex-col gap-6">
        <CustomHeader header="New Quote" btnConfigList={btnConfigList} />

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
                <QuoteSummaryForm
                  refNo={refNo}
                  currQuote={currQuote}
                  submitAction={() => changeFormCurrSection(toggleId.Items)}
                />
              )}
              {formCurrSection === toggleId.Items && (
                <ItemSelectForm
                  submitAction={() => changeFormCurrSection(toggleId.Sections)}
                />
              )}

              {/* {formCurrSection === toggleId.Sections && (
                <SectionSelectForm
                  refNo={refNo}
                  submitAction={() =>
                    navigate(`/quotes/${refNo}`, { replace: true })
                  }
                />
              )} */}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
