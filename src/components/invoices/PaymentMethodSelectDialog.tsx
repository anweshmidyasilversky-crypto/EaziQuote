import { PaymentMethods } from "@/types/api.responses.type";
import CustomDialog from "../common/CustomDialog";
import StripeAdvisoryDialog from "@/pages/settings/StripeAdvisoryDialog";
import { useState } from "react";

export type PaymentMethodSelectDialogProps = {
  selectedMethod: PaymentMethods;
  toggleSelectedMethod: (paymentMethod: string) => void;
  isOpen: boolean;
  toggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isStipeConnected: boolean;
};

function PaymentMethodSelectDialog({
  selectedMethod,
  toggleSelectedMethod,
  isOpen,
  toggleOpen,
  isStipeConnected,
}: PaymentMethodSelectDialogProps) {
  const [isStripAdvisoryOpen, toggleStripAdvisoryOpen] = useState(false);
  const [method, setMethod] = useState<string>(selectedMethod);
  const handlePaymentMethodSelect = () => {
    if (method === PaymentMethods.stripe && !isStipeConnected) {
      toggleOpen(false);
      setMethod(PaymentMethods.cash);
      toggleStripAdvisoryOpen(true);
      return;
    }
    toggleSelectedMethod(method);
    toggleOpen(false);
  };

  return (
    <>
      {" "}
      <CustomDialog
        dialogOpen={isOpen}
        toggleDialogOpen={toggleOpen}
        header="Payment Method"
        withFooter
        footerBtnLabel="Save Item"
        footerBtnAction={handlePaymentMethodSelect}
        closeOnSubmit={false}
      >
        <div className="p-5 flex flex-col gap-2 w-[40vw]">
          <select
            className="input-field w-full"
            value={method}
            onChange={(e) => {
              const selectedMethod = e.currentTarget.value;
              setMethod(selectedMethod);
            }}
            id="payment_method_select"
          >
            {Object.keys(PaymentMethods).map((key) => {
              return (
                <option key={key} value={key}>
                  {key[0].toUpperCase() + key.slice(1)}
                </option>
              );
            })}
          </select>

          {method === PaymentMethods.cash && (
            <span className="text-warning-text text-wrap wrap-anywhere text-xs">
              {" "}
              {`You are about to record a cash payment. Please ensure the amount has been physically received before proceeding.`}{" "}
            </span>
          )}
        </div>
      </CustomDialog>
      <StripeAdvisoryDialog
        type="connect"
        isOpen={isStripAdvisoryOpen}
        toggleIsOpen={toggleStripAdvisoryOpen}
      />
    </>
  );
}

export default PaymentMethodSelectDialog;
