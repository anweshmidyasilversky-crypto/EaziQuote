import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { XIcon } from "lucide-react";
import { CustomBtn } from "./CustomBtn";

export type CustomDialogProps = {
  dialogOpen: boolean;
  toggleDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  header?: string;
  headerCls?: string;
  children?: React.ReactNode;
  withFooter?: boolean;
  footerBtnLabel?: string;
  footerBtnAction?: () => void;
};

function CustomDialog({
  dialogOpen,
  toggleDialogOpen,
  children,
  header,
  headerCls,
  withFooter,
  footerBtnLabel,
  footerBtnAction,
}: CustomDialogProps) {
  return (
    <Dialog open={dialogOpen} onOpenChange={toggleDialogOpen}>
      <DialogTrigger />
      <DialogContent
        className={`dashboard-card-theme bg-white w-fit! max-w-screen! ring-0 p-0 gap-0`}
        showCloseButton={false}
      >
        <div
          className={`bg-custom-dialog-primary w-full min-h-15 flex justify-between items-center border-b-2 border-b-client-detail-secondary rounded-t-[7px] p-5 ${headerCls}`}
        >
          <span className="font-medium text-base"> {header} </span>
          <XIcon
            className={`text-muted hover:text-black-text`}
            onClick={() => toggleDialogOpen(false)}
          />
        </div>

        {children}

        {withFooter && (
          <div className="flex flex-col gap-6 py-5">
            <div className="dashed-y-separators" />
            <div className="px-5">
              <CustomBtn
                buttonLabel={footerBtnLabel ?? "Got it!"}
                onClick={() => {
                  footerBtnAction?.();
                  toggleDialogOpen((curr) => !curr);
                }}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CustomDialog;
