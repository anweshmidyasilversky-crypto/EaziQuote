import WarningDialog from "./WarningDialog";

export type SignatureWarningModalProps = {
  isOpen: boolean;
  toggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action?: () => void;
};

function SignatureWarningModal({
  isOpen,
  toggleOpen,
  action,
}: SignatureWarningModalProps) {
  return (
    <WarningDialog
      open={isOpen}
      toggleOpen={toggleOpen}
      warningHeader="Add Your Signature"
      warningContent="Adding a signature helps build trust and makes your quote feel complete and professional."
      withCancelBtn={false}
      acceptBtnLabel="Add Signature"
      acceptAction={action}
    />
  );
}

export default SignatureWarningModal;
