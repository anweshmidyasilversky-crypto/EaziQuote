import { assets } from "@/assets/icons";
import WarningDialog from "./WarningDialog";

export type SubscriptionWarningModalProps = {
  isOpen: boolean;
  toggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action?: () => void;
};
function SubscriptionWarningModal({
  isOpen,
  toggleOpen,
  action,
}: SubscriptionWarningModalProps) {
  return (
    <WarningDialog
      open={isOpen}
      toggleOpen={toggleOpen}
      warningHeader="Subscription Required"
      warningContent="To continue using EaziQuote, please activate or renew your subscription."
      acceptBtnLabel="Activate Subscription"
      acceptAction={action}
      withCancelBtn={false}
      warningImgElement={
        <div className="relative flex items-center justify-center">
          <img src={assets.polygonGradient} className="h-20 aspect-auto" />
          <img
            src={assets.subsCriptionWhiteIcon}
            className="h-7.5 aspect-auto z-10 absolute"
          />
        </div>
      }
    />
  );
}

export default SubscriptionWarningModal;
