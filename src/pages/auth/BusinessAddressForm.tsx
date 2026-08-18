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
import { useNavigate } from "react-router";
import type { UserType } from "../../types/user.type";
import { toast } from "react-toastify";

export function BusinessAddressForm() {
  const [postCode, selectPostCode] = useState<string | null>(null);
  const dispath = useAppDispatch();
  const navigate = useNavigate();

  const { control, setValue, handleSubmit, clearErrors } =
    useForm<BusinessAddressPayload>({
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
      clearErrors();
    }
  };

  const onsubmit = (data: BusinessAddressPayload) => {
    const businessAddress: Partial<UserType> = {
      ...data,
      isBusinessAddressProvided: true,
    };
    dispath(updateUser(businessAddress));
    toast.success("Successfully added business address");
  };

  return (
    <div className="auth-card-offset">
      <Card className="auth-card ring-0 flex flex-col gap-5">
        <CardHeader className="w-full flex justify-center">
          <CardTitle className="font-sans font-semibold text-[24px]">
            {" "}
            Business Address{" "}
          </CardTitle>
        </CardHeader>

        <CardContent className="w-full flex flex-col gap-5 justify-center">
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
            placeholder="Street address"
          />

          <CustomInput
            control={control}
            name="city"
            fieldName="City"
            inptType="text"
            placeholder="City"
          />

          <CustomInput
            control={control}
            name="postCode"
            fieldName="Postcode"
            inptType="text"
            placeholder="Postcode"
          />

          <CustomInput
            control={control}
            name="country"
            fieldName="Country"
            inptType="text"
            placeholder="Country"
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
