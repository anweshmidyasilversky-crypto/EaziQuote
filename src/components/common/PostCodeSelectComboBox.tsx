import {
  Combobox,
  ComboboxInput,
  ComboboxEmpty,
  ComboboxList,
  ComboboxContent,
  ComboboxItem,
} from "../ui/combobox";

export type PostCodeSelectComboBoxProps<T> = {
  postalCodes: string[];
  postCode: T;
  selectPostCode: React.Dispatch<React.SetStateAction<T>>;
  addressSetter: (postCode: string) => void;
};

export function PostCodeSelectComboBox<T>({
  postalCodes,
  postCode,
  selectPostCode,
  addressSetter,
}: PostCodeSelectComboBoxProps<T>) {
  return (
    <Combobox
      items={postalCodes}
      value={postCode}
      onValueChange={(value) => {
        selectPostCode(value as T);
        addressSetter(value as string);
      }}
    >
      <ComboboxInput
        placeholder="Search postcode"
        className={`w-full flex flex-row items-center p-3 gap-3 h-11 bg-white border border-[#CED1DA] rounded-[7px] self-stretch flex-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60`}
      />
      <ComboboxContent className={`w-full`}>
        <div className={"bg-white z-100 w-full"}>
          <ComboboxEmpty>No postcodes matched</ComboboxEmpty>
          <ComboboxList className={`w-full`}>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </div>
      </ComboboxContent>
    </Combobox>
  );
}
