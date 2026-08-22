import React from "react";
import { Separator } from "../ui/separator";

export interface ActivitySummaryProps {
  summaryConfig: {
    summaryTitle: string;
    summaryIcon: string;
    summary: number | string;
  }[];
}

export function ActivitySummary({ summaryConfig }: ActivitySummaryProps) {
  return (
    <div className="flex w-full items-stretch rounded-[10px] dashboard-card-theme overflow-hidden">
      {summaryConfig.map((summaryDet, index) => (
        <React.Fragment key={summaryDet.summaryTitle}>
          <div className="flex p-3 sm:p-4 flex-col justify-center gap-2 flex-1 min-w-0">
            <span className="wrap-break-word text-placeholder-text font-medium uppercase text-[11px] sm:text-[12px] leading-tight">
              {summaryDet.summaryTitle}
            </span>

            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <img
                src={summaryDet.summaryIcon}
                alt=""
                className="h-5 w-5 sm:h-6 sm:w-6 object-contain shrink-0"
              />
              <span className="font-semibold text-sm sm:text-base truncate">
                {summaryDet.summary}
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
