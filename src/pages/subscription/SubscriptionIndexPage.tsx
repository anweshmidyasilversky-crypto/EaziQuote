import { useEffect, useMemo, useState } from "react";
import type {
  OfferingProductDetails,
  RevenueCatOffering,
  RevenueCatPackage,
} from "@/types/api.responses.type";
import { useAppSelector } from "@/redux/store";
import useOfferListings from "@/hooks/apis/revenewCat/useOfferListings";
import useRevenewCatMutation from "@/hooks/apis/revenewCat/useRevenewCatMutation";
import { SubscriptionCard } from "@/components/subscriptions/SubscriptionCard";
import { showErrorToast } from "@/api/axiosInstance";

interface Plan {
  offering: RevenueCatOffering;
  pkg: RevenueCatPackage;
  product: OfferingProductDetails;
}

const isMonthly = (pkg: RevenueCatPackage) =>
  pkg.identifier === "$rc_monthly" ||
  pkg.platform_product_identifier.toLowerCase().includes("monthly");

const isWebOffering = (offering: RevenueCatOffering) =>
  [
    offering.identifier,
    offering.description,
    ...offering.packages.map((p) => p.platform_product_identifier),
    ...offering.packages.map((p) => p.web_checkout_url ?? ""),
    offering.web_checkout_url ?? "",
    offering.web_checkout_urls?.production ?? "",
    offering.web_checkout_urls?.sandbox ?? "",
  ]
    .join(" ")
    .toLowerCase()
    .includes("web");

const pickPackage = (offering: RevenueCatOffering) =>
  offering.packages.find((p) => p.web_checkout_url && isMonthly(p)) ??
  offering.packages.find((p) => p.web_checkout_url) ??
  offering.packages.find(isMonthly) ??
  offering.packages[0];

function PlanSkeleton() {
  return (
    <div
      aria-busy="true"
      className="w-full max-w-112.5 min-h-136.25 rounded-[15px] bg-separator/40 animate-pulse"
    />
  );
}

function SubscriptionIndexPage() {
  const user = useAppSelector((state) => state.user);
  const { offerings: revenueCatData, isFetching } = useOfferListings({
    userId: user.id,
  });
  const { getProductDetailsMutation } = useRevenewCatMutation();

  const [results, setResults] = useState<Record<string, Plan | "error">>({});
  const [subscriptionCards, setSubciptionCards] = useState<React.ReactNode[]>(
    [],
  );

  // Memoise so the effect below only re-runs when the API data actually changes
  const webOfferings = useMemo(
    () => (revenueCatData?.offerings ?? []).filter(isWebOffering),
    [revenueCatData],
  );

  useEffect(() => {
    setResults({});
    if (webOfferings.length === 0) return;

    let cancelled = false;
    const finish = (id: string, value: Plan | "error") => {
      if (!cancelled) setResults((prev) => ({ ...prev, [id]: value }));
    };

    webOfferings.forEach((offering) => {
      const pkg = pickPackage(offering);
      if (!pkg) return finish(offering.identifier, "error");
      getProductDetailsMutation.mutate(
        {
          userId: user.id,
          productId: pkg.platform_product_identifier,
        },
        {
          onSuccess: (products) => {
            products.product_details.forEach((product) => {
              setSubciptionCards((curr) => [
                ...curr,
                <SubscriptionCard
                  productDetails={product}
                  checkoutUrl={
                    pkg.web_checkout_url ?? offering.web_checkout_url
                  }
                />,
              ]);
            });
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    });

    return () => {
      cancelled = true;
    };
  }, [webOfferings, user.id]);

  const pending = webOfferings.filter((o) => !results[o.identifier]).length;
  const loading = isFetching || pending > 0;

  const cards = webOfferings.flatMap((offering) => {
    const result = results[offering.identifier];
    if (result === "error") return [];
    if (!result) return [<PlanSkeleton key={offering.identifier} />];
    return [
      <SubscriptionCard
        key={offering.identifier}
        productDetails={result.product}
        checkoutUrl={result.pkg.web_checkout_url ?? offering.web_checkout_url}
      />,
    ];
  });

  return (
    <div className="m-6 flex flex-col items-center gap-12">
      <div className="flex flex-col gap-2 min-h-13.5">
        <h1 className="font-bold text-2xl text-center">Plans & Pricing</h1>
        <span className="font-medium text-sm text-placeholder-text text-center">
          Simple pricing with complete access to all features.
        </span>
      </div>

      {cards.length > 0 ? (
        <div className="w-full max-w-250 flex flex-col justify-center items-center">
          {subscriptionCards}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-40">
          <span className="text-placeholder-text">
            {loading
              ? "Loading subscription plans..."
              : "No subscription plans available."}
          </span>
        </div>
      )}
    </div>
  );
}

export default SubscriptionIndexPage;
