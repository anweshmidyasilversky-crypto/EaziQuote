import React, { useMemo, useState } from "react";
import { HeaderBreadCrumb } from "../../components/common/CustomBreadCrumb";
import { CustomHeader } from "../../components/common/CustomHeader";
import type { CustomBtnProps } from "../../components/common/CustomBtn";
import { assets } from "../../assets/icons";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "../../components/common/CustomToggleGroup";
import QuoteSummaryForm from "../../components/quotes/QuoteSummaryForm";

enum toggleId {
  Summary = "summary",
  Items = "items",
  Sections = "sections",
}

export type CreateQuotePageProps = {};
export function CreateQuotePage() {
  const [formCurrSection, changeFormCurrSection] = useState<string>(
    toggleId.Summary,
  );

  const btnConfigList: CustomBtnProps[] = useMemo(
    () => [
      {
        buttonLabel: "Download",
        leftIcon: assets.plusIcon,
      },
      {
        buttonLabel: "share",
        leftIcon: assets.shareIconWhite,
        className: `bg-manage-quote-secondary hover:bg-manage-quote-secondary`,
      },
    ],
    [],
  );

  const isActive = (id: string) => true;
  const toggleConfig: CustomToggleGroupProps["toggleConfig"] = useMemo(
    () => [
      {
        btnId: toggleId.Summary,
        btnLabel: "Summary",
        disabled: !isActive(toggleId.Summary),
      },
      {
        btnId: toggleId.Items,
        btnLabel: "Items",
        disabled: !isActive(toggleId.Items),
      },
      {
        btnId: toggleId.Sections,
        btnLabel: "Sections",
        disabled: !isActive(toggleId.Sections),
      },
    ],
    [],
  );

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
              <QuoteSummaryForm />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
