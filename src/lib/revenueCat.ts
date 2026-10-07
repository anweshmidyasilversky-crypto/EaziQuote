import { Purchases } from "@revenuecat/purchases-js";

let purchasesInstance: Purchases | undefined;
let userChangeQueue: Promise<void> = Promise.resolve();

export function configureRevenueCat(appUserId: string): Promise<void> {
  const normalizedAppUserId = appUserId.trim();
  if (!normalizedAppUserId) {
    return Promise.reject(new Error("RevenueCat requires a non-empty app user ID."));
  }

  if (!purchasesInstance) {
    if (Purchases.isConfigured()) {
      purchasesInstance = Purchases.getSharedInstance();
    } else {
      const apiKey = import.meta.env.VITE_REVENUECAT_WEB_API_KEY;
      if (!apiKey) {
        return Promise.reject(
          new Error("Missing VITE_REVENUECAT_WEB_API_KEY configuration."),
        );
      }

      purchasesInstance = Purchases.configure({
        apiKey,
        appUserId: normalizedAppUserId,
      });
    }
  }

  const instance = purchasesInstance;
  const changeUser = userChangeQueue.then(async () => {
    if (instance.getAppUserId() !== normalizedAppUserId) {
      await instance.changeUser(normalizedAppUserId);
    }
  });

  userChangeQueue = changeUser.then(
    () => undefined,
    () => undefined,
  );

  return changeUser;
}
