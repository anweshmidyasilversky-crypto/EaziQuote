import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "@/components/common/CustomToggleGroup";
import BankInfoForm from "@/components/settings/BankInfoForm";
import BillingPreferenceForm from "@/components/settings/BillingPreferenceForm";
import QuoteSettingsForm from "@/components/settings/QuoteSettingsForm";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { useState } from "react";

enum toggle {
  payInfo = "Payment Info",
  billPref = "Billing Preferences",
  quoteSetting = "Quote & Invoice Settings",
}

function PaymentAndInvoicePage() {
  const user = useAppSelector((state) => state.user);
  const [activeToggle, toggleActive] = useState<string>(toggle.payInfo);
  const toggleConfig: CustomToggleGroupProps["toggleConfig"] = [
    {
      btnId: toggle.payInfo,
      btnLabel: toggle.payInfo,
    },
    {
      btnId: toggle.billPref,
      btnLabel: toggle.billPref,
      disabled: !user.bankInfoAdded,
    },
    {
      btnId: toggle.quoteSetting,
      btnLabel: toggle.quoteSetting,
      disabled: !user.billingPreferenceProvided,
    },
  ];

  return (
    <>
      <HeaderBreadCrumb pageName="Payments & Invoicing" />
      <div className="m-6 bg-white flex flex-col gap-8 rounded-[10px]">
        <CustomToggleGroup
          toggleConfig={toggleConfig}
          toggleActive={toggleActive}
          activeId={activeToggle}
          btnCls={cn(
            `bg-transparent hover:bg-transparent text-nowrap disabled:text-placeholder-text flex-start p-0! text-left w-fit`,
          )}
          className={cn(
            `[&_.btnActive]:text-brand-dark [&_.btnActive]:border-b [&_.btnActive]:border-brand-dark pt-2 px-5 gap-5! [&_.btnActive]:text-base`,
          )}
        />

        {activeToggle === toggle.payInfo && (
          <BankInfoForm
            submitAction={() => toggleActive(toggle.billPref)}
            defaultValues={user?.bankInfo}
          />
        )}

        {activeToggle === toggle.billPref && (
          <BillingPreferenceForm
            defaultValues={user?.billingPref}
            submitAction={() => toggleActive(toggle.quoteSetting)}
          />
        )}

        {activeToggle === toggle.quoteSetting && <QuoteSettingsForm />}
      </div>
    </>
  );
}

export default PaymentAndInvoicePage;
