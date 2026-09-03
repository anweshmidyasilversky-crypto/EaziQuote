import CustomDialog from "@/components/common/CustomDialog";
import { cn } from "@/lib/utils";
import React from "react";

export type StripeAdvisoryDialogProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: "connect" | "advisory";
  action?: () => void;
};

function StripeAdvisoryDialog({
  isOpen,
  toggleIsOpen,
  type,
  action,
}: StripeAdvisoryDialogProps) {
  return (
    <CustomDialog
      dialogOpen={isOpen}
      toggleDialogOpen={toggleIsOpen}
      header="Payments & Processing Fees"
      withXIcon={true}
      headerCls={cn(
        `bg-custom-dialog-secondary border-0! [&_span]:font-semibold! [&_span]:text-2xl! items-start gap-16 [&_span]:text-nowrap`,
      )}
      withFooter={true}
      showFooterSeparator={false}
      footerBtnLabel={type === "connect" ? "Connect Stripe" : "Got it"}
      contentCls={cn(`p-8! max-w-120!`)}
      footerCls={cn(`py-8! pb-4!`)}
      footerBtnCls={cn(`p-0! w-full grow`)}
      footerBtnAction={action}
    >
      <div className="flex flex-col gap-4 px-4 text-wrap [&_p]:text-placeholder-text [&_p]:text-sm">
        <p> {"Online payments are securely processed through Stripe."} </p>
        <p>
          {
            "A 0.5% platform processing fee applies to all card and online payments processed through Stripe, including deposit payments.Standard Stripe transaction fees may also apply separately."
          }
        </p>
        <p>
          {
            "  These fees are deducted internally from your payout, your customers will always pay the exact invoice or deposit amount shown to them. "
          }
        </p>
        <p>
          {
            "Platform fees do not apply to cash payments, bank transfers, or offline payments."
          }
        </p>
      </div>
    </CustomDialog>
  );
}

export default StripeAdvisoryDialog;
