import { useAppSelector } from "@/redux/store";
import { useState } from "react";

function useHasSubscription() {
  const user = useAppSelector((state) => state.user);

  const [signatureWarningOpen, setSignatureWarningOpen] = useState(false);
  const [bankdetailsWarningOpen, setBankdetailsWarningOpen] = useState(false);
  const [subsEndWarningOpen, setSubsEndWarningOpen] = useState(false);

  const checkCanCreateRecord = () => {
    const hasBankDetails = user.hasBankAccountDetailAdded;
    const hasSignature = user.hasSignatureAdded;
    const hasSubscription = user.is_trial_period || user.is_subscription_active;

    if (!hasBankDetails) {
      setBankdetailsWarningOpen(true);
    }

    if (!hasSignature) {
      setSignatureWarningOpen(true);
    }

    if (!hasSubscription) {
      setSubsEndWarningOpen(true);
    }

    return hasBankDetails && hasSignature && hasSubscription;
  };

  return {
    signatureWarningOpen,
    setSignatureWarningOpen,
    bankdetailsWarningOpen,
    setBankdetailsWarningOpen,
    subsEndWarningOpen,
    setSubsEndWarningOpen,
    checkCanCreateRecord,
  };
}

export default useHasSubscription;
