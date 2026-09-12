import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useEffect, useRef, useState } from "react";
import { Input as InputPrimitive } from "@base-ui/react";
import { Spinner } from "../ui/spinner";

interface CustomComboboxProps<T, V = T> {
  items: T[];
  onValueChange?: (value: V | null) => void;
  getItemLabel?: (item: T) => string;
  getItemValue?: (item: T) => V;
  placeholder?: string;
  emptyMessage?: string;
  className?: InputPrimitive.Props["className"];
  selected?: T;
  inputLeftNode?: React.ReactNode;
  inputRightNode?: React.ReactNode;
  inptFieldValue?: string;
  inptFieldChange?: (data: string) => void;
  isFetching?: boolean;
}

export function CustomCombobox<T, V = T>({
  items,
  onValueChange,
  getItemLabel = (item) => String(item),
  getItemValue = (item) => item as unknown as V,
  placeholder = "Select an item...",
  emptyMessage = "No results found.",
  className,
  selected,
  inputLeftNode,
  inputRightNode,
  inptFieldValue,
  inptFieldChange,
  isFetching,
}: CustomComboboxProps<T, V>) {
  const [value, setValue] = useState<string | null>(
    selected ? getItemLabel(selected) : null,
  );

  // Measure the trigger row's actual width so the popover can match it exactly,
  // regardless of whether the underlying Popover exposes an anchor-width CSS var.
  const triggerRef = useRef<HTMLDivElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number>();

  useEffect(() => {
    if (!triggerRef.current) return;
    const el = triggerRef.current;
    const update = () => setTriggerWidth(el.getBoundingClientRect().width);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleValueChange = (item: T | null) => {
    onValueChange?.(item === null ? null : getItemValue(item));
    setValue(getItemLabel(item as T));
  };

  return (
    <Combobox<T>
      items={items}
      onValueChange={(item) => handleValueChange?.(item)}
      value={value as T}
      itemToStringValue={(item) => {
        return getItemLabel(item);
      }}
      filter={null}
    >
      <div
        ref={triggerRef}
        className="relative flex gap-2 h-11 items-center w-full"
      >
        {inputLeftNode}
        <ComboboxInput
          placeholder={placeholder}
          className={`
            input-field h-full max-h-11 grow
            rounded-lg border border-gray-300
            px-3.5 text-[15px] text-gray-900 placeholder:text-gray-400
            outline-none transition-colors
            focus:border-blue-600 focus:ring-2 focus:ring-blue-100
            ${className}
          `}
          value={inptFieldValue}
          onChange={(e) => inptFieldChange?.(e.target.value)}
        />
        {inputRightNode}
      </div>

      <ComboboxContent
        style={triggerWidth ? { width: triggerWidth } : undefined}
        className="
          z-100 bg-white
          rounded-lg border border-gray-200
          shadow-lg shadow-black/10
          overflow-hidden
          ring-0!
          dashboard-card-theme
        "
        align="center"
        alignOffset={20}
      >
        <ComboboxEmpty className="px-4 py-3 text-sm text-gray-400">
          {isFetching ? (
            <Spinner className="text-brand-dark w-4 h-4" />
          ) : (
            emptyMessage
          )}
        </ComboboxEmpty>

        <ComboboxList className="max-h-64 overflow-y-auto py-1">
          {(item) => (
            <ComboboxItem
              key={String(getItemLabel(item))}
              value={item}
              className="
                px-4 py-3 text-[15px] leading-snug text-gray-800
                cursor-pointer select-none
                border-b border-gray-100 last:border-b-0
                hover:bg-gray-50
                data-highlighted:bg-brand-dark data-highlighted:text-white
                data-[highlighted]:brand-dark
              "
            >
              {getItemLabel(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
