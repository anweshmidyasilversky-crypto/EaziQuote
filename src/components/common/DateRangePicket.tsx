import React, { useState } from "react";
import { assets } from "../../assets/icons";
import { Calendar } from "../ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export interface DateRange {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export type DateRangePickerProps = {
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
};
export function DateRangePicker({
  dateRange,
  setDateRange,
}: DateRangePickerProps) {
  console.log(dateRange);
  const [calenderOpen, toggleCalenderOpen] = useState<
    Record<keyof DateRange, boolean>
  >({
    startDate: false,
    endDate: false,
  });

  const formatLocalDate = (date: Date | undefined): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const popoverToggle = (key: keyof DateRange) => {
    toggleCalenderOpen((curr) => ({
      ...curr,
      [key]: !curr[key],
    }));
  };
  return (
    <div className="flex flex-row justify-between gap-4 items-center">
      {Object.keys(dateRange).map((dateKey) => {
        const key = dateKey as keyof DateRange;
        return (
          <div className="flex flex-col gap-2" key={key}>
            <span className="text-sm min-h-4.25">
              {" "}
              {key === "startDate" ? "Start Date" : "End Date"}{" "}
            </span>
            <InputGroup className="border-2 border-muted min-h-11">
              <InputGroupAddon align={"inline-end"}>
                <img src={assets.calendarIcon} className="w-5 aspect-square" />
              </InputGroupAddon>

              <Popover
                open={calenderOpen[key]}
                onOpenChange={() => popoverToggle(key)}
              >
                <PopoverTrigger onClick={() => popoverToggle(key)}>
                  <InputGroupInput
                    placeholder={
                      key === "startDate" ? "Start Date" : "End Date"
                    }
                    type="text"
                    value={formatLocalDate(dateRange[key])}
                    className="min-h-11 rounded-[7px] border-muted"
                    onClick={() => popoverToggle(key)}
                    readOnly
                  />
                </PopoverTrigger>

                <PopoverContent
                  className={`bg-white opacity-100 ring-0`}
                  side="bottom"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={dateRange[key]}
                    onSelect={(value) => {
                      setDateRange({ ...dateRange, [key]: value });
                      popoverToggle(key);
                    }}
                    className="w-full h-full [&_table]:w-full [&_tr]:flex [&_tr]:justify-between [&_td]:flex-1 [&_th]:flex-1 [&_th]:text-center"
                    modifiersClassNames={{
                      selected:
                        "bg-[#0f172a] text-white font-medium hover:bg-[#0f172a]!",

                      today:
                        "ring-1 bg-transparent text-slate-900 font-bold hover:ring-0",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </InputGroup>
          </div>
        );
      })}
    </div>
  );
}
