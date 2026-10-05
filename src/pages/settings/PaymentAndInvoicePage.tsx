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
import {
  SettingsPaymentPageReason,
  type SettingsLocationProps,
} from "@/types/common.types";
import { useState } from "react";
import { useLocation } from "react-router";

enum toggle {
  payInfo = "Payment Info",
  billPref = "Billing Preferences",
  quoteSetting = "Quote & Invoice Settings",
}

function PaymentAndInvoicePage() {
  const user = useAppSelector((state) => state.user);
  const location = useLocation();
  const { reason } = (location.state ?? {}) as SettingsLocationProps;
  const { billing_details } = user.company;
  const { billing_preferences, vat_settings } = useAppSelector(
    (state) => state.appConfig,
  );
  const [activeToggle, toggleActive] = useState<string>(
    reason === SettingsPaymentPageReason.addSignature
      ? toggle.quoteSetting
      : toggle.payInfo,
  );
  const toggleConfig: CustomToggleGroupProps["toggleConfig"] = [
    {
      btnId: toggle.payInfo,
      btnLabel: toggle.payInfo,
    },
    {
      btnId: toggle.billPref,
      btnLabel: toggle.billPref,
      disabled: !user.hasBankAccountDetailAdded,
    },
    {
      btnId: toggle.quoteSetting,
      btnLabel: toggle.quoteSetting,
      disabled: !user.hasBankAccountDetailAdded,
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
            defaultValues={{
              paymentLink: billing_details.email,
              bankName: billing_details.bank_name,
              accName: billing_details.name,
              accNumber: billing_details.account_number,
              sortCode: billing_details.sort_code,
            }}
          />
        )}

        {activeToggle === toggle.billPref && (
          <BillingPreferenceForm
            defaultValues={{
              vatRate: billing_preferences.vat.id,
              quoteExpiry: billing_preferences.quote_expiration,
              paymentTerms: billing_preferences.payment_expiration,
            }}
            vatSetting={vat_settings}
            selectedVat={billing_preferences.vat}
            submitAction={() => toggleActive(toggle.quoteSetting)}
          />
        )}

        {activeToggle === toggle.quoteSetting && (
          <QuoteSettingsForm
            signatureModalOpenDefault={
              reason === SettingsPaymentPageReason.addSignature ? true : false
            }
          />
        )}
      </div>
    </>
  );
}

export default PaymentAndInvoicePage;
