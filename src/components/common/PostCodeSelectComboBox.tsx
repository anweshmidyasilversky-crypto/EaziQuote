import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { getAddressList } from "@/api/address.api";
import { CustomCombobox } from "./CustomCombobox";
import type { AddressDetails } from "@/types/api.responses.type";
import { showErrorToast } from "@/api/axiosInstance";

export type PostCodeSelectComboBoxProps = {
  addressSetter?: (address: AddressDetails) => void;
};

export function PostCodeSelectComboBox({
  addressSetter,
}: PostCodeSelectComboBoxProps) {
  const [searchTerm, setSearchTerm] = useState("M11AE");
  const debouncedSearchTerm = useDebounce({ value: searchTerm });

  const { data: addressList, error } = useQuery({
    queryKey: ["address", debouncedSearchTerm],
    queryFn: () => getAddressList(debouncedSearchTerm),
  });

  if (error) {
    showErrorToast(error);
  }

  return (
    <CustomCombobox
      items={addressList?.payload ?? []}
      getItemLabel={(addressDetail) => addressDetail?.formatted_address}
      onValueChange={(addressDetail) => {
        if (addressDetail) {
          addressSetter?.(addressDetail);
        }
      }}
      inptFieldValue={searchTerm}
      inptFieldChange={(postCode) => setSearchTerm(postCode)}
    />
  );
}
