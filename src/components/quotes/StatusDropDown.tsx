import { ChevronDown } from "lucide-react";
import { QuoteActivityStatus, type QuoteData } from "../../constants/dummyData";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import StatusBadge from "../common/StatusBadge";
import { useState } from "react";

export type StatusDropDownProps = {
  currStatus: QuoteData["status"];
  toggleStatus: React.Dispatch<React.SetStateAction<QuoteData["status"]>>;
};
export function StatusDropDown({
  currStatus,
  toggleStatus,
}: StatusDropDownProps) {
  const [popoverOpen, togglePopoverOpen] = useState(false);
  return (
    <Popover open={popoverOpen} onOpenChange={togglePopoverOpen}>
      <PopoverTrigger>
        <StatusBadge status={currStatus} ChevronIcon={ChevronDown} />
      </PopoverTrigger>

      <PopoverContent
        className={`ring-0 bg-white dashboard-card-theme p-0 rounded-[7px] py-2 m-0 max-w-fit!`}
        side="bottom"
      >
        <div className="flex flex-col">
          {(
            Object.keys(QuoteActivityStatus) as Array<
              keyof typeof QuoteActivityStatus
            >
          ).map((key) => {
            return (
              <span
                key={key.toString()}
                onClick={() => {
                  toggleStatus?.(QuoteActivityStatus[key]);
                  togglePopoverOpen(false);
                }}
                className={`${key.toString() === currStatus ? "bg-slate-100" : ""} cursor-pointer px-5 py-1 h-fit hover:bg-slate-100`}
              >
                {key.toString()}
              </span>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
