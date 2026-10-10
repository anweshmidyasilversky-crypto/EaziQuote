import { assets } from "@/assets/icons";
import CustomDialog from "./CustomDialog";
import { XIcon } from "lucide-react";

export type AccessDeniedModalProps = {
  isOpen: boolean;
  toggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  supportBtnAction?: () => void;
};

function AccessDeniedModal({
  isOpen,
  toggleOpen,
  supportBtnAction,
}: AccessDeniedModalProps) {
  return (
    <CustomDialog
      dialogOpen={isOpen}
      toggleDialogOpen={toggleOpen}
      withHeader={false}
      withFooter={true}
      showFooterSeparator={false}
      footerBtnLabel="Contact Support"
      footerBtnAction={() => supportBtnAction?.()}
      footerBtnCls="w-full"
      closeOnSubmit={false}
    >
      <div className="flex flex-col items-center justify-center gap-8 p-8 max-w-112.5">
        <img src={assets.accessDeniedIcon} className="w-20 aspect-auto" />
        <XIcon
          className="absolute top-5 right-5 text-placeholder-text hover:text-black-text"
          onClick={() => toggleOpen(false)}
        />

        <div className="relative flex flex-col gap-8 items-center justify-center">
          <h3 className="font-semibold text-2xl"> {"Access Denied"} </h3>
          <span className="text-placeholder-text text-sm text-wrap wrap-break-word text-center">
            {" "}
            {
              "Access to EaziQuote has been restricted by the admin. Please contact our support team to resolve this issue."
            }{" "}
          </span>
        </div>
      </div>
    </CustomDialog>
  );
}

export default AccessDeniedModal;
