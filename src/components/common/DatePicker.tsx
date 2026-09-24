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
  const [pickedDate, setPickedDate] = useState(selectedDate ?? new Date());

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
            className="bg-white opacity-100 ring-0"
            side="bottom"
            align="start"
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
              }}
              className="w-full h-full [&_table]:w-full [&_tr]:flex [&_tr]:justify-between [&_td]:flex-1 [&_th]:flex-1 [&_th]:text-center"
              modifiersClassNames={{
                selected:
                  "bg-brand-dark text-white font-medium hover:bg-brand-dark!",
                today: "ring-1 bg-gray text-black font-bold hover:ring-0",
              }}
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
