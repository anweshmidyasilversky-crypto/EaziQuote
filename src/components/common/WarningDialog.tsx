import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { assets } from "@/assets/icons";
import { XIcon } from "lucide-react";
import { CustomBtn } from "./CustomBtn";
import { cn } from "@/lib/utils";

export type WarningDialogProps = {
  open: boolean;
  toggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  warningHeader: string;
  warningContent: string;
  contentCls?: string;
  acceptBtnLabel?: string;
  cancelBtnLabel?: string;
  acceptAction?: () => void;
  xIconAction?: () => void;
  isAccepting?: boolean;
};

function WarningDialog({
  open,
  toggleOpen,
  contentCls,
  warningHeader,
  warningContent,
  acceptBtnLabel,
  cancelBtnLabel,
  acceptAction,
  xIconAction,
  isAccepting,
}: WarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger />
      <DialogContent
        className={`dashboard-card-theme bg-white min-h-85 ring-0 p-8 gap-0 rounded-xl min-w-112.5 ${contentCls}`}
        showCloseButton={false}
      >
        <div className="flex w-full justify-end">
          <XIcon
            className="w-6 aspect-square text-slate-500 hover:text-black-text"
            onClick={() => {
              xIconAction?.();
              toggleOpen(false);
            }}
          />
        </div>
        <div className="flex flex-col gap-8 items-center justify-center">
          <img src={assets.warningIconBlue} className="w-20 aspect-auto" />
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="font-semibold text-2xl"> {warningHeader} </h2>
            <p className="text-wrap wrap-break-word text-sm text-center">
              {" "}
              {warningContent}{" "}
            </p>
          </div>

          <div className="flex w-full gap-4 [&_button]:grow">
            <CustomBtn
              buttonLabel={acceptBtnLabel ?? `Confirm`}
              onClick={() => acceptAction?.()}
              isSubmitting={isAccepting}
            />
            <CustomBtn
              buttonLabel={cancelBtnLabel ?? `Cancel`}
              btncls={cn(
                `bg-warning-dialog-cencel-bg text-warning-dialog-cancel-text hover:bg-warning-dialog-cencel-bg`,
              )}
              onClick={() => toggleOpen(false)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WarningDialog;
