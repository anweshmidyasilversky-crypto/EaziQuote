import { assets } from "@/assets/icons";
import { ImageInput } from "@/components/auth/imageInput";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomCombobox } from "@/components/common/CustomCombobox";
import { CustomInput } from "@/components/common/customInput";
import { Separator } from "@/components/ui/separator";
import { postalCodes, type AddressDetail } from "@/constants/dummyData";
import { cn, getAddress } from "@/lib/utils";
import { updateUser } from "@/redux/slices/user.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import type { BusinessAddressPayload } from "@/types/businessAddress.payload.type";
import type { BusinessProfilePayload } from "@/types/businessProfile.payload.type";
import { businessAddressSchema } from "@/validation/businessAddress.payload.schema";
import { BusinessProfilePayloadSchema } from "@/validation/businessProfile.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

function BusinessInfoPage() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [imgFile, toggleImgFile] = useState<File | undefined>(undefined);
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const { control, setValue, handleSubmit, clearErrors } = useForm<
    Omit<BusinessProfilePayload & BusinessAddressPayload, "trade">
  >({
    defaultValues: async () => {
      const baseDefaults = {
        street: "",
        country: "",
        city: "",
        postCode: "",
        brandColor: "#00f",
        businessName: "business",
        businessPhoneNo: "",
        vatRegistered: false,
        showBusinessName: false,
      } as BusinessProfilePayload & BusinessAddressPayload;
      try {
        const img = await fetch(assets.userImg);
        const blob = await img.blob();
        return Object.assign(baseDefaults, user, {
          brandLogo: new File([blob], assets.userImg, {
            type: "image/png",
          }),
        });
      } catch {
        return baseDefaults;
      }
    },
    resolver: yupResolver(
      BusinessProfilePayloadSchema.omit(["trade"]).concat(
        businessAddressSchema,
      ),
    ),
  });

  const [isVatRegistered, showBusinessName] = useWatch({
    control: control,
    name: ["vatRegistered", "showBusinessName"],
  });

  useEffect(() => {
    setValue("brandLogo", imgFile);
  }, [imgFile]);

  const addressSetter = (postCode: string) => {
    const address = getAddress(postCode);
    if (address) {
      Object.keys(address).forEach((key) => {
        setValue(
          key as keyof BusinessAddressPayload,
          address[key as keyof AddressDetail],
        );
        clearErrors(key as keyof BusinessAddressPayload);
      });
    }
  };

  const submitHandler = (
    data: Omit<BusinessAddressPayload & BusinessProfilePayload, "trade">,
  ) => {
    toggleIsSubmitting(true);
    dispatch(updateUser(data));
    toast.success(`Updated business info`);
    toggleIsSubmitting(false);
  };

  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex gap-8 items-center">
          <div className="flex items-start">
            <ImageInput
              imgFile={imgFile}
              setImgFile={toggleImgFile}
              alt={assets.previewBrandlogo}
              altClass={cn(`object-contain self-center!`)}
              withEditIcon
              iconBadgeCls={cn(`h-9 w-9`)}
            />
          </div>

          <div className="max-w-52">
            <CustomInput
              control={control}
              name="brandColor"
              fieldName="Select Brand Colour"
              inptType="color"
            />
          </div>
        </div>

        <p className="text-sm">
          {" "}
          {"Your logo will appear on quotes, invoices, and client emails."}{" "}
        </p>
      </div>

      <Separator className={`bg-separator`} />

      <div className="flex gap-5">
        <div className="flex flex-col gap-3">
          <CustomInput
            control={control}
            name="businessName"
            fieldName="Business Name"
          />

          <CustomInput
            control={control}
            name="showBusinessName"
            fieldName="Show business name on Quotes & Invoices"
            inptType="switch"
            orientation="horizontal"
            className={cn(
              `max-w-11! ${showBusinessName ? `translate-y-0!` : `translate-y-1!`}`,
            )}
          />
        </div>

        <CustomInput
          control={control}
          name="businessPhoneNo"
          fieldName="Phone"
          placeholder="(+44)   456-798-5542"
        />
      </div>

      <CustomCombobox
        items={postalCodes}
        onValueChange={(postCode) => addressSetter(postCode as string)}
        placeholder="Search postcode"
        getItemLabel={(item) => item ?? ""}
      />

      <CustomInput control={control} name="street" fieldName="Street Address" />

      <div className="flex gap-5">
        <CustomInput
          control={control}
          name="city"
          fieldName="City"
          placeholder="City"
        />
        <CustomInput
          control={control}
          name="postCode"
          fieldName="Postcode"
          placeholder="postcode"
        />
      </div>

      <CustomInput
        control={control}
        name="country"
        fieldName="Country"
        placeholder="country"
      />

      <Separator className={`bg-separator`} />

      <CustomInput
        control={control}
        name="vatRegistered"
        fieldName="Are you VAT registered?"
        inptType="switch"
        orientation="horizontal"
        className={cn(
          `max-w-11! ${isVatRegistered ? `translate-y-0!` : `translate-y-1!`} `,
        )}
      />

      {isVatRegistered && (
        <CustomInput
          control={control}
          name="vatNumber"
          fieldName="VAT Number"
          placeholder="vat number"
        />
      )}

      <CustomBtn
        buttonLabel="Update Profile"
        isSubmitting={isSubmitting}
        onClick={handleSubmit(submitHandler)}
      />
    </div>
  );
}

export default BusinessInfoPage;
