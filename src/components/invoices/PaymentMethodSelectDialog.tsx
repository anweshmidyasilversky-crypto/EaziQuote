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
    console.log(
      `Selected method: ${method}, strip connected: ${isStipeConnected}`,
    );
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
        <div className="p-5">
          <select
            className="input-field min-w-125"
            onChange={(e) => {
              const selectedMethod = e.currentTarget.value;
              setMethod(selectedMethod);
            }}
            id="payment_method_select"
          >
            {Object.keys(PaymentMethods).map((key) => {
              return (
                <option key={key} value={key} selected={key === selectedMethod}>
                  {" "}
                  {key[0].toUpperCase() + key.slice(1)}{" "}
                </option>
              );
            })}
          </select>
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
