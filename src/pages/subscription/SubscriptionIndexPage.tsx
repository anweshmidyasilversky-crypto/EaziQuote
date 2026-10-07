import { SubscriptionCard } from "@/components/subscriptions/SubscriptionCard";
import { usePurchases } from "@/context/RevenueCatContext";
import useOfferings from "@/hooks/ReveneuCat/useOfferings";

function SubscriptionIndexPage() {
  const purchases = usePurchases();
  const { offerings, isFetching } = useOfferings({
    purchases: purchases.purchases,
    enabled: Boolean(purchases.purchases),
  });
  const products = offerings?.current?.availablePackages ?? [];

  return (
    <div className="m-6 flex flex-col items-center gap-12">
      <div className="flex flex-col gap-2 min-h-13.5">
        <h1 className="font-bold text-2xl text-center">Plans & Pricing</h1>
        <span className="font-medium text-sm text-placeholder-text text-center">
          Simple pricing with complete access to all features.
        </span>
      </div>

      {products.length > 0 ? (
        <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {products.map((product) => {
            return (
              <SubscriptionCard
                productDetails={product.product}
                pkg={product}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-40">
          <span className="text-placeholder-text">
            {purchases.isLoading || isFetching
              ? "Loading subscription plans..."
              : "No subscription plans available."}
          </span>
        </div>
      )}
    </div>
  );
}

export default SubscriptionIndexPage;
