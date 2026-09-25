import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import StatusBadge from "../common/StatusBadge";
import { useState } from "react";
import { QuoteStatus, type Quote } from "@/types/api.responses.type";

export type StatusDropDownProps = {
  currStatus: string | undefined;
  statusSelectAction?: (status: QuoteStatus) => void;
};
export function StatusDropDown({
  currStatus,
  statusSelectAction,
}: StatusDropDownProps) {
  const [popoverOpen, togglePopoverOpen] = useState(false);
  return (
    <Popover open={popoverOpen} onOpenChange={togglePopoverOpen}>
      <PopoverTrigger>
        <StatusBadge
          status={
            currStatus
              ? currStatus[0].toLocaleUpperCase() + currStatus.slice(1)
              : "draft"
          }
          ChevronIcon={ChevronDown}
        />
      </PopoverTrigger>

      <PopoverContent
        className={`ring-0 bg-white dashboard-card-theme p-0 rounded-[7px] py-2 m-0 max-w-fit!`}
        side="bottom"
      >
        <div className="flex flex-col">
          {(Object.keys(QuoteStatus) as Array<keyof typeof QuoteStatus>).map(
            (key) => {
              return (
                <span
                  key={key.toString()}
                  onClick={() => {
                    togglePopoverOpen(false);
                    statusSelectAction?.(QuoteStatus[key]);
                  }}
                  className={`${key === currStatus ? "bg-slate-100" : ""} cursor-pointer px-5 py-1 h-fit hover:bg-slate-100`}
                >
                  {key[0].toLocaleUpperCase() + key.slice(1)}
                </span>
              );
            },
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
