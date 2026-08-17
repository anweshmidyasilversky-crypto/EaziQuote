import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../../components/ui/combobox";
import {
  addressList,
  postalCodes,
  type AddressDetail,
} from "../../constants/dummyData";
import { useForm } from "react-hook-form";
import { type BusinessAddressPayload } from "../../types/businessAddress.payload.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { businessAddressSchema } from "../../validation/businessAddress.payload.schema";
import { CustomInput } from "../../components/common/customInput";
import { useAppDispatch } from "../../redux/store";
import { updateUser } from "../../redux/slices/user.slice";

export function BusinessAddressForm() {
  const [postCode, selectPostCode] = useState<string | null>(null);
  const dispath = useAppDispatch();

  const { control, setValue, handleSubmit } = useForm<BusinessAddressPayload>({
    defaultValues: {
      postCode: "",
      street: "",
      city: "",
      country: "",
    },
    resolver: yupResolver(businessAddressSchema),
  });

  const getAddressFromPostalCode = (postCode: string) => {
    const address = addressList.find(
      (address) => address.postCode === postCode,
    );

    if (address) {
      Object.keys(address).map((key) => {
        const objKey = key as keyof AddressDetail;
        setValue(objKey, address[objKey]);
      });
    }
  };

  const onsubmit = (data: BusinessAddressPayload) => {
    console.log(data);
    dispath(updateUser(data));
  };

  return (
    <div className="relative w-full flex justify-center -mt-4 z-10">
      <Card className="w-full max-w-112.5 p-8 auth-card ring-0">
        <CardHeader>
          <CardTitle className="font-sans font-semibold text-[24px] text-center">
            {" "}
            Business Address{" "}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <Combobox
            items={postalCodes}
            value={postCode}
            onValueChange={(value) => {
              selectPostCode(value);
              getAddressFromPostalCode(value as string);
            }}
          >
            <ComboboxInput placeholder="Search postcode" />
            <ComboboxContent>
              <ComboboxEmpty> No postcodes matched </ComboboxEmpty>
              <ComboboxList className={"bg-white z-10"}>
                {postalCodes.map((postalCode) => {
                  return (
                    <ComboboxItem key={postalCode} value={postalCode}>
                      {" "}
                      {postalCode}{" "}
                    </ComboboxItem>
                  );
                })}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <CustomInput
            control={control}
            name="street"
            fieldName="Street Address"
            inptType="text"
          />

          <CustomInput
            control={control}
            name="city"
            fieldName="City"
            inptType="text"
          />

          <CustomInput
            control={control}
            name="postCode"
            fieldName="Postcode"
            inptType="text"
          />

          <CustomInput
            control={control}
            name="country"
            fieldName="Country"
            inptType="text"
          />

          <button className="btn-auth" onClick={handleSubmit(onsubmit)}>
            {" "}
            Continue{" "}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
