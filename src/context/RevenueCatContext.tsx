import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ErrorCode,
  PurchasesError,
  type CustomerInfo,
  type Package,
  type Purchases,
} from "@revenuecat/purchases-js";
import { toast } from "react-toastify";
import { configureRevenueCat } from "@/lib/revenueCat";

interface RevenueCatContextType {
  purchases: Purchases | null;
  customerInfo: CustomerInfo | null;
  isSubscribed: boolean;
  isLoading: boolean;
  purchasePackage: (pkg: Package) => Promise<boolean>;
}

const RevenueCatContext = createContext<RevenueCatContextType>({
  purchases: null,
  customerInfo: null,
  isSubscribed: false,
  isLoading: true,
  purchasePackage: async () => false,
});

export const RevenueCatProvider = ({
  children,
  appUserId,
}: {
  children: React.ReactNode;
  appUserId?: number;
}) => {
  const [purchases, setPurchases] = useState<Purchases | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!appUserId) {
      setPurchases(null);
      setCustomerInfo(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const initRevenueCat = async () => {
      try {
        setIsLoading(true);
        setPurchases(null);
        setCustomerInfo(null);

        const purchasesInstance = await configureRevenueCat(
          appUserId.toString(),
        );
        if (!isMounted) return;
        setPurchases(purchasesInstance);

        const info = await purchasesInstance.getCustomerInfo();
        if (isMounted) setCustomerInfo(info);
      } catch (error) {
        console.error("Failed to initialize RevenueCat:", error);
        toast.error((error as Error).message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initRevenueCat();

    return () => {
      isMounted = false;
    };
  }, [appUserId]);

  const purchasePackage = async (pkg: Package): Promise<boolean> => {
    if (!purchases) return false;

    try {
      const { customerInfo: updatedInfo } = await purchases.purchase({
        rcPackage: pkg,
      });
      setCustomerInfo(updatedInfo);
      return true;
    } catch (error) {
      console.error("Purchase failed or was cancelled:", error);
      if (error instanceof PurchasesError) {
        if (error.errorCode === ErrorCode.UserCancelledError) {
          toast.info(`Purchase cancelled`);
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error((error as Error).message);
      }
      return false;
    }
  };

  const isSubscribed = Boolean(
    customerInfo?.entitlements.active &&
    Object.keys(customerInfo.entitlements.active).length > 0,
  );

  return (
    <RevenueCatContext.Provider
      value={{
        purchases,
        customerInfo,
        isSubscribed,
        isLoading,
        purchasePackage,
      }}
    >
      {children}
    </RevenueCatContext.Provider>
  );
};

export const usePurchases = () => useContext(RevenueCatContext);
