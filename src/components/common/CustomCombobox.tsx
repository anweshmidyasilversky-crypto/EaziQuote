import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useState } from "react";
import { Input as InputPrimitive } from "@base-ui/react";

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
}: CustomComboboxProps<T, V>) {
  const [value, setValue] = useState<string | null>(
    selected ? getItemLabel(selected) : null,
  );

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
    >
      <div className="flex gap-2 h-11 items-center w-full">
        {inputLeftNode}
        <ComboboxInput
          placeholder={placeholder}
          className={`input-field h-full max-h-11 grow ${className}`}
        />
        {inputRightNode}
      </div>

      <ComboboxContent className="z-100 w-full bg-white">
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>

        <ComboboxList>
          {(item) => (
            <ComboboxItem key={String(getItemLabel(item))} value={item}>
              {getItemLabel(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
