import { assets } from "@/assets/icons";
import { CustomBtn } from "@/components/common/CustomBtn";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React from "react";

function SubscriptionIndexPage() {
  const btnConfig: {
    id: string;
    label: string;
    leftIcon: string;
  }[] = [
    {
      id: "Unlimited Quotes-&-Invoices",
      label: "Unlimited Quotes & Invoices",
      leftIcon: assets.infinityIcon,
    },
    {
      id: "Unlimited-Clients",
      label: "Unlimited Clients",
      leftIcon: assets.clientGroupIcon,
    },
    {
      id: "Custom-Branding",
      label: "Custom Branding",
      leftIcon: assets.brushIcon,
    },
    {
      id: "Advanced-Analytics-&-Insights",
      label: "Advanced Analytics & Insights",
      leftIcon: assets.statisticsIcon,
    },
  ];

  return (
    <div className="m-6 flex flex-col items-center justify-center gap-12">
      <div className="flex flex-col gap-2 min-h-13.5">
        <h1 className="font-bold text-2xl text-center">
          {" "}
          {"Plans & Pricing"}{" "}
        </h1>
        <span className="font-medium text-sm text-placeholder-text text-center">
          {" "}
          {"Simple pricing with complete access to all features."}{" "}
        </span>
      </div>

      <div className="min-h-136.25 min-w-112.5 dashboard-card-theme flex flex-col gap-2 rounded-[15px]">
        <div className="flex justify-center items-center min-h-22.5 w-full p-6 font-semibold font-mori">
          <span className="text-[40px]"> {"$99"} </span>
          <span className="text-[28px] text-placeholder-text"> {"/mo"} </span>
        </div>
        <Separator className={`bg-separator`} />
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-5">
            <div className="flex justify-center items-center gap-3">
              <img src={assets.starIcon} className="w-3 aspect-square" />
              <span className="uppercase font-medium text-base text-center">
                {" "}
                {"benefits"}{" "}
              </span>
              <img src={assets.starIcon} className="w-3 aspect-square" />
            </div>

            <div className="flex flex-col gap-4 p-3 border rounded-xl border-separator bg-subcription-card-primary">
              {btnConfig.map((config, index) => (
                <React.Fragment key={config.id}>
                  <div className="flex gap-3 items-center">
                    <div className="w-8 flex aspect-square bg-white rounded-[7px] items-center justify-center">
                      <img src={config.leftIcon} className="w-4 aspect-auto" />
                    </div>
                    <span className="text-base"> {config.label} </span>
                  </div>
                  {index < btnConfig.length - 1 && (
                    <Separator className={`bg-separator`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex flex-col gap-2 [&_button]:font-medium [&_button]:text-base [&_button]:min-h-12 [&_button]:w-full">
              <CustomBtn
                buttonLabel="Subscribe Now"
                btncls={cn(
                  `bg-subscription-gradient hover:bg-subscription-gradient `,
                )}
              />

              <CustomBtn
                buttonLabel="Restore"
                btncls={cn(
                  `bg-transparent hover:bg-transparent text-black-text border border-separator`,
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionIndexPage;
