import { cn } from "@/lib/utils";
import { SubsctiptionPeriodLabel } from "@/types/api.responses.type";
import { Separator } from "../ui/separator";
import { assets } from "@/assets/icons";
import React from "react";
import { CustomBtn } from "../common/CustomBtn";
import type { Package, Product } from "@revenuecat/purchases-js";
import { usePurchases } from "@/context/RevenueCatContext";

const featureConfig = [
  {
    label: "Unlimited Quotes & Invoices",
    leftIcon: assets.infinityIcon,
  },
  {
    label: "Unlimited Clients",
    leftIcon: assets.clientGroupIcon,
  },
  {
    label: "Custom Branding",
    leftIcon: assets.brushIcon,
  },
  {
    label: "Advanced Analytics & Insights",
    leftIcon: assets.statisticsIcon,
  },
];

export function SubscriptionCard({
  productDetails,
  pkg,
}: {
  productDetails: Product;
  pkg: Package;
}) {
  const { purchasePackage } = usePurchases();
  const handleSubscribe = async () => {
    await purchasePackage(pkg);
  };

  const formattedPrice = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: productDetails.currentPrice.currency,
  }).format(productDetails.currentPrice.amountMicros / 1000000);

  return (
    <div
      className={cn(
        "w-full",
        "max-w-112.5",
        "min-h-136.25",
        "dashboard-card-theme",
        "flex flex-col gap-2",
        "rounded-[15px]",
        "transform transition-all delay-200 hover:-translate-y-0.5 hover:shadow-2xl",
      )}
    >
      {/* Price */}
      <div className="flex justify-center items-center min-h-22.5 w-full p-6 font-semibold font-mori">
        <span className="text-[40px]">{formattedPrice}</span>

        <span className="text-[28px] text-placeholder-text">
          {
            SubsctiptionPeriodLabel[
              productDetails.normalPeriodDuration as keyof typeof SubsctiptionPeriodLabel
            ]
          }
        </span>
      </div>

      <Separator className="bg-separator" />

      <div className="flex flex-col gap-8 p-6">
        {/* Product Name */}
        <div className="flex flex-col gap-1 text-center">
          <span className="font-semibold text-xl">
            {productDetails.title || productDetails.description}
          </span>

          {productDetails.title && productDetails.description && (
            <span className="text-sm text-placeholder-text">
              {productDetails.description}
            </span>
          )}
        </div>

        {/* Benefits */}
        <div className="flex flex-col gap-5">
          <div className="flex justify-center items-center gap-3">
            <img src={assets.starIcon} className="w-3 aspect-square" alt="" />

            <span className="uppercase font-medium text-base text-center">
              Benefits
            </span>

            <img src={assets.starIcon} className="w-3 aspect-square" alt="" />
          </div>

          <div className="flex flex-col gap-4 p-3 border rounded-xl border-separator bg-subcription-card-primary">
            {featureConfig.map((feature, index) => (
              <React.Fragment key={feature.label}>
                <div className="flex gap-3 items-center">
                  <div className="w-8 flex aspect-square bg-white rounded-[7px] items-center justify-center shrink-0">
                    <img
                      src={feature.leftIcon}
                      className="w-4 aspect-auto"
                      alt=""
                    />
                  </div>

                  <span className="text-base">{feature.label}</span>
                </div>

                {index < featureConfig.length - 1 && (
                  <Separator className="bg-separator" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 [&_button]:font-medium [&_button]:text-base [&_button]:min-h-12 [&_button]:w-full">
            <CustomBtn
              buttonLabel="Subscribe Now"
              onClick={handleSubscribe}
              btncls={cn(
                "bg-subscription-gradient",
                "hover:bg-subscription-gradient",
              )}
            />

            <CustomBtn
              buttonLabel="Restore"
              btncls={cn(
                "bg-transparent",
                "hover:bg-transparent",
                "text-black-text",
                "border border-separator",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
