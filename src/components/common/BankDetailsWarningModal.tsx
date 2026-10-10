import WarningDialog from "./WarningDialog";

export type BankDetailsWarningModal = {
  isOpen: boolean;
  toggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action?: () => void;
};

function BankDetailsWarningModal({
  isOpen,
  toggleOpen,
  action,
}: BankDetailsWarningModal) {
  return (
    <WarningDialog
      open={isOpen}
      toggleOpen={toggleOpen}
      warningHeader="Complete Your Setup"
      warningContent="Add your bank details and signature to ensure your quotes look professional and include payment information."
      acceptBtnLabel="Complete Setup"
      acceptAction={action}
      withCancelBtn={false}
    />
  );
}

export default BankDetailsWarningModal;
