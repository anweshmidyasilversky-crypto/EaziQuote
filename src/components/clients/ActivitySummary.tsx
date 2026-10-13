import React from "react";
import { Separator } from "../ui/separator";

export interface ActivitySummaryProps {
  summaryConfig: {
    summaryTitle: string;
    summaryIcon: string;
    summary: number | string | undefined;
  }[];
}

export function ActivitySummary({ summaryConfig }: ActivitySummaryProps) {
  return (
    <div className="flex w-full min-h-27.75 items-stretch rounded-[10px] dashboard-card-theme overflow-hidden">
      {summaryConfig.map((summaryDet, index) => (
        <React.Fragment key={summaryDet.summaryTitle}>
          <div className="flex p-3 sm:p-4 flex-col justify-between gap-2 flex-1 @container">
            <span className="wrap-break-word text-placeholder-text font-medium uppercase @min-[180px]:text-[14px] text-[12px] sm:text-[12px] leading-tight">
              {summaryDet.summaryTitle}
            </span>

            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 @container">
              <div className="h-8 w-8 flex items-center">
                <img
                  src={summaryDet.summaryIcon}
                  alt=""
                  className="min-h-5 min-w-5 max-w-full max-h-full sm:h-6 sm:w-6 object-contain grow"
                />
              </div>
              <span className="font-semibold text-sm sm:text-base truncate @min-[180px]:text-2xl">
                {summaryDet.summary ?? "0"}
              </span>
            </div>
          </div>

          {index < summaryConfig.length - 1 && (
            <Separator
              orientation="vertical"
              className="h-auto self-stretch bg-separator shrink-0"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
