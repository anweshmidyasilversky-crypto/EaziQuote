import React, { useState } from "react";
import { assets } from "../../assets/icons";
import { Calendar } from "../ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input as InputPrimitive } from "@base-ui/react";

export interface DateRange {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export type DateRangePickerProps = {
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  startDateAlias?: string;
  endDateAlias?: string;
  startDateStyle?: InputPrimitive.Props["className"];
  endDateStyle?: InputPrimitive.Props["className"];
} & InputPrimitive.Props;

export function DateRangePicker({
  dateRange,
  setDateRange,
  startDateAlias,
  endDateAlias,
  className,
  startDateStyle,
  endDateStyle,
}: DateRangePickerProps) {
  const [calenderOpen, toggleCalenderOpen] = useState<
    Record<keyof DateRange, boolean>
  >({
    startDate: false,
    endDate: false,
  });
  const [startDateName, endDateName] = [
    startDateAlias ?? "Start Date",
    endDateAlias ?? "End Date",
  ];

  const formatLocalDate = (date: Date | undefined): string => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex w-full flex-1 flex-row items-center gap-4">
      {Object.keys(dateRange).map((dateKey) => {
        const key = dateKey as keyof DateRange;

        return (
          <div className="flex min-w-0 flex-1 flex-col gap-2" key={key}>
            <span className="min-h-4.25 text-sm">
              {key === "startDate" ? startDateName : endDateName}
            </span>

            <InputGroup
              className={`min-h-11 w-full border border-input-field-border ${className} ${key === "startDate" ? startDateStyle : endDateStyle}`}
            >
              <Popover
                open={calenderOpen[key]}
                onOpenChange={(open) =>
                  toggleCalenderOpen((curr) => ({
                    ...curr,
                    [key]: open,
                  }))
                }
              >
                <PopoverTrigger className="w-full">
                  <InputGroupInput
                    placeholder={
                      key === "startDate" ? startDateName : endDateName
                    }
                    type="text"
                    value={formatLocalDate(dateRange[key])}
                    className={`min-h-11 w-full rounded-[7px]`}
                    readOnly
                  />
                </PopoverTrigger>

                <PopoverContent
                  className="bg-white opacity-100 ring-0"
                  side="bottom"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={dateRange[key]}
                    onSelect={(value) => {
                      setDateRange({
                        ...dateRange,
                        [key]: value,
                      });

                      toggleCalenderOpen((curr) => ({
                        ...curr,
                        [key]: false,
                      }));
                    }}
                    className="w-full h-full [&_table]:w-full [&_tr]:flex [&_tr]:justify-between [&_td]:flex-1 [&_th]:flex-1 [&_th]:text-center"
                    modifiersClassNames={{
                      selected:
                        "bg-brand-dark text-white font-medium hover:bg-brand-dark!",
                      today: "ring-1 bg-gray text-black font-bold hover:ring-0",
                    }}
                  />
                </PopoverContent>
              </Popover>

              <InputGroupAddon align="inline-end">
                <img src={assets.calendarIcon} className="aspect-square w-5" />
              </InputGroupAddon>
            </InputGroup>
          </div>
        );
      })}
    </div>
  );
}
