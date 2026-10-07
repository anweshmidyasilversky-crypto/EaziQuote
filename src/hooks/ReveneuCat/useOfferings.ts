import {
  type Offerings,
  Purchases,
  PurchasesError,
} from "@revenuecat/purchases-js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export type useOfferingsProps = {
  purchases: Purchases | null;
  enabled?: boolean;
};

function useOfferings({ purchases, enabled = true }: useOfferingsProps) {
  const [offering, setOffering] = useState<Offerings | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!enabled || !purchases) {
      setOffering(undefined);
      setIsFetching(false);
      return;
    }

    let cancelled = false;
    setOffering(undefined);

    const getOffering = async () => {
      setIsFetching(true);
      try {
        const offerings = await purchases.getOfferings();
        if (!cancelled) setOffering(offerings);
      } catch (error) {
        if (!cancelled) {
          if (error instanceof PurchasesError) {
            toast.error(error.message);
          } else if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Unable to load subscription offerings.");
          }
        }
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    };

    void getOffering();

    return () => {
      cancelled = true;
    };
  }, [purchases, enabled]);

  return {
    offerings: enabled ? offering : undefined,
    isFetching: enabled ? isFetching : false,
  };
}

export default useOfferings;
