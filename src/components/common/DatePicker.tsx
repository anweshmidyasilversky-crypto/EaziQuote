import { assets } from "@/assets/icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { Calendar } from "../ui/calendar";

export type DatePickerProps = {
  selectedDate?: Date;
  className?: string;
  errorMsg?: string;
  dateSetter?: (date: Date | undefined) => void;
};
function DatePicker({
  selectedDate,
  className,
  errorMsg,
  dateSetter,
}: DatePickerProps) {
  const [open, toggleOpen] = useState(false);
  const [pickedDate, setPickedDate] = useState(selectedDate);

  const formatLocalDate = (date: Date | undefined): string => {
    if (!date) return "";

    const formatted = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);

    return formatted;
  };
  return (
    <div className="flex flex-col gap-2">
      <label className="input-label self-start"> Date </label>
      <InputGroup
        className={`min-h-11 w-full border border-input-field-border ${errorMsg ? `input-error` : ``} ${className}`}
      >
        <Popover open={open} onOpenChange={toggleOpen}>
          <PopoverTrigger className="w-full">
            <InputGroupInput
              placeholder={`Select a Date`}
              type="text"
              value={formatLocalDate(pickedDate)}
              className={`min-h-11 w-full rounded-[7px]`}
              readOnly
            />
          </PopoverTrigger>

          <PopoverContent
            className="relative w-fit! min-w-70! max-w-[calc(100vw-2rem)]! rounded-none! bg-transparent! p-0! opacity-100 shadow-none! ring-0! before:pointer-events-none before:absolute before:-top-2 before:left-5 before:z-20 before:h-2 before:w-3.5 before:bg-brand-dark before:[clip-path:polygon(50%_0,100%_100%,0_100%)] data-[side=top]:before:top-auto data-[side=top]:before:-bottom-2 data-[side=top]:before:bg-white data-[side=top]:before:[clip-path:polygon(0_0,100%_0,50%_100%)] data-[side=left]:before:left-auto data-[side=left]:before:-right-2 data-[side=left]:before:top-5 data-[side=left]:before:h-3.5 data-[side=left]:before:w-2 data-[side=left]:before:bg-white data-[side=left]:before:[clip-path:polygon(0_0,100%_50%,0_100%)] data-[side=right]:before:-left-2 data-[side=right]:before:top-5 data-[side=right]:before:h-3.5 data-[side=right]:before:w-2 data-[side=right]:before:bg-white data-[side=right]:before:[clip-path:polygon(100%_0,100%_100%,0_50%)]"
            side="bottom"
            align="start"
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
              captionLayout="dropdown"
              selected={pickedDate}
              onSelect={(value) => {
                dateSetter?.(value);
                if (value) {
                  setPickedDate(value);
                }
                toggleOpen(false);
              }}
              className="w-full h-full [&_table]:w-full [&_tr]:flex [&_tr]:justify-between [&_td]:flex-1 [&_th]:flex-1 [&_th]:text-center"
              disabled={{ before: new Date() }}
            />
          </PopoverContent>
        </Popover>

        <InputGroupAddon align="inline-end">
          <img src={assets.calendarIcon} className="aspect-square w-5" />
        </InputGroupAddon>
      </InputGroup>
      {errorMsg && <p className="error-text"> {errorMsg} </p>}
    </div>
  );
}

export default DatePicker;
