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
import { useAppDispatch } from "@/redux/store";
import { updateQuote as updateQuoteRedux } from "@/redux/slices/quotes.slice";

enum toggleId {
  Summary = "summary",
  Items = "items",
  Sections = "sections",
}

export function CreateQuotePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formCurrSection, changeFormCurrSection] = useState<string>(
    toggleId.Summary,
  );
  const params = useParams<{ id: string | undefined }>();

  const { quote, isFetching: isQuoteFetching } = useQuoteDetails({
    quote_id: params.id as string,
    enabled: params.id ? true : false,
  });

  useEffect(() => {
    if (quote) {
      dispatch(updateQuoteRedux(quote));
    }
  }, [quote]);

  const dummyRefNo = `QT-${new Date().getFullYear()}-1`;
  const refNo =
    (quote?.reference_number ?? "").trim().length > 0
      ? (quote?.reference_number as string)
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
      disabled: (quote?.items.length ?? 0) <= 0,
    },
  ];

  return (
    <React.Fragment>
      <HeaderBreadCrumb pageName="New Quote" />

      {isQuoteFetching ? (
        <div className="flex w-full h-full items-center justify-center">
          <Spinner className="text-brand-dark w-1/10 h-1/10" />
        </div>
      ) : (
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
                    currQuote={quote}
                    submitAction={() => changeFormCurrSection(toggleId.Items)}
                  />
                )}
                {formCurrSection === toggleId.Items && (
                  <ItemSelectForm
                    submitAction={() =>
                      changeFormCurrSection(toggleId.Sections)
                    }
                  />
                )}

                {formCurrSection === toggleId.Sections && (
                  <SectionSelectForm
                    submitAction={() =>
                      navigate(`/quotes/${quote?.id}`, { replace: true })
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
