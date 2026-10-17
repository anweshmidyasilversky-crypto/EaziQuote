import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      if (dateRange.endDate < dateRange.startDate) {
        setDateRange((curr) => ({
          ...curr,
          endDate: undefined,
        }));
      }
    }
  }, [dateRange.startDate]);

  return (
    <div className="flex w-full flex-1 flex-col md:flex-row items-center gap-4">
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
                  className={`relative w-fit! min-w-70! max-w-[calc(100vw-2rem)]! rounded-none! bg-transparent! p-0! opacity-100 shadow-none! ring-0! before:pointer-events-none before:absolute before:-top-2 before:z-20 before:h-2 before:w-3.5 before:bg-brand-dark before:[clip-path:polygon(50%_0,100%_100%,0_100%)] data-[side=top]:before:top-auto data-[side=top]:before:-bottom-2 data-[side=top]:before:bg-white data-[side=top]:before:[clip-path:polygon(0_0,100%_0,50%_100%)] data-[side=left]:before:left-auto data-[side=left]:before:-right-2 data-[side=left]:before:top-5 data-[side=left]:before:h-3.5 data-[side=left]:before:w-2 data-[side=left]:before:bg-white data-[side=left]:before:[clip-path:polygon(0_0,100%_50%,0_100%)] data-[side=right]:before:-left-2 data-[side=right]:before:top-5 data-[side=right]:before:h-3.5 data-[side=right]:before:w-2 data-[side=right]:before:bg-white data-[side=right]:before:[clip-path:polygon(100%_0,100%_100%,0_50%)] ${key === "endDate" ? "before:left-auto before:right-5" : "before:left-5"}`}
                  side="bottom"
                  align={key === "endDate" ? "end" : "start"}
                  sideOffset={8}
                  collisionAvoidance={{
                    side: "flip",
                    align: "shift",
                    fallbackAxisSide: "start",
                  }}
                  collisionPadding={8}
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
                    disabled={
                      key === "startDate"
                        ? undefined
                        : dateRange.startDate
                          ? { before: dateRange.startDate }
                          : undefined
                    }
                    captionLayout="dropdown"
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
