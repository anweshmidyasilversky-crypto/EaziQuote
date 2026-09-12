import React, { useState } from "react";
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
import { useAppSelector } from "../../redux/store";
import SectionSelectForm from "@/components/quotes/SectionSelectForm";
import { useQuery } from "@tanstack/react-query";
import { getQuoteDetails } from "@/api/quotes.api";
import { showErrorToast } from "@/api/axiosInstance";

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
  const params = useParams<{ id: string }>();

  const { data: quoteDetailsResponse, error: quoteFetchError } = useQuery({
    queryKey: ["createQuote", "client", params.id],
    queryFn: () => getQuoteDetails(params.id as string),
  });

  // Only if we are sending request with valid id and request fails then show error toast
  // To avoid showing not found error while creating new quote
  if (params.id && quoteFetchError) {
    showErrorToast(quoteFetchError);
  }
  const quote = quoteDetailsResponse?.payload;
  const currQuote = useAppSelector((state) => state.quote);
  const dummyRefNo = `QT-${new Date().getFullYear()}-1`;
  const refNo =
    currQuote.reference_number.trim().length > 0
      ? currQuote.reference_number
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
      disabled: currQuote.items.length <= 0,
    },
  ];

  return (
    <React.Fragment>
      <HeaderBreadCrumb pageName="New Quote" />

      <div className="p-5 flex flex-col gap-6">
        <CustomHeader header="New Quote" btnConfigList={btnConfigList} />

        <div className="flex gap-6">
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
                  submitAction={() => changeFormCurrSection(toggleId.Items)}
                  currQuote={quote}
                />
              )}
              {/* {formCurrSection === toggleId.Items && (
                <ItemSelectForm
                  refNo={refNo}
                  submitAction={() => changeFormCurrSection(toggleId.Sections)}
                  preSelectedItems={preSelectedItems}
                />
              )} */}

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
