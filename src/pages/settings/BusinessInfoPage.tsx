import { showErrorToast } from "@/api/axiosInstance";
import { assets } from "@/assets/icons";
import { ImageInput } from "@/components/auth/imageInput";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomInput } from "@/components/common/CustomInput";
import { PostCodeSelectComboBox } from "@/components/common/PostCodeSelectComboBox";
import { Separator } from "@/components/ui/separator";
import useUserMutations from "@/hooks/apis/user/useUserMutations";
import { cn } from "@/lib/utils";
import { updateCompany as updateCompanyRedux } from "@/redux/slices/user.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import type { BusinessAddressPayload } from "@/types/businessAddress.payload.type";
import type { BusinessProfilePayload } from "@/types/businessProfile.payload.type";
import { businessAddressSchema } from "@/validation/businessAddress.payload.schema";
import { BusinessProfilePayloadSchema } from "@/validation/businessProfile.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

function BusinessInfoPage() {
  const {
    company: {
      address: companyAddress,
      brand_color,
      name: businessName,
      phone_number: businessPhone,
      vat_number,
      is_company_name_show,
      logo,
    },
  } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [companyLogo, setCompanyLogo] = useState<File | undefined>(undefined);
  const companyLogoURl = useRef<string>(logo ?? assets.cameraIcon);
  const { companyUpdateMutation } = useUserMutations();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<Omit<BusinessProfilePayload & BusinessAddressPayload, "trade">>({
    defaultValues: {
      street: companyAddress.address,
      country: companyAddress.country,
      city: companyAddress.city,
      postCode: companyAddress.postcode,
      brandColor: brand_color,
      businessName: businessName,
      businessPhoneNo: businessPhone.startsWith(`(+44)`)
        ? businessPhone.slice(5)
        : businessPhone,
      vatRegistered: vat_number ? true : false,
      showBusinessName: is_company_name_show,
      vatNumber: vat_number,
      brandLogo: undefined,
    } as BusinessProfilePayload & BusinessAddressPayload,
    resolver: yupResolver(
      BusinessProfilePayloadSchema.omit(["trade"]).concat(
        businessAddressSchema,
      ),
    ),
  });

  const [isVatRegistered] = useWatch({
    control: control,
    name: ["vatRegistered"],
  });

  const submitHandler = (
    data: Omit<BusinessAddressPayload & BusinessProfilePayload, "trade">,
  ) => {
    companyUpdateMutation.mutate(
      {
        _method: "put",
        name: data.businessName,
        phone: data.businessPhoneNo,
        address: data.street,
        logo: companyLogo ?? undefined,
        city: data.city,
        postcode: data.postCode,
        country: data.country,
        brand_color: data.brandColor,
        is_company_name_show: data.showBusinessName ? 1 : 0,
        vat_number: data.vatNumber,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          dispatch(updateCompanyRedux(response.payload));
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  useEffect(() => {
    if (errors) {
      console.log(errors);
    }
  }, [errors]);

  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex gap-8 items-center">
          <div className="flex items-start">
            <ImageInput
              imgUrl={companyLogoURl.current}
              setImgFile={(img) => {
                companyLogoURl.current = URL.createObjectURL(img);
                setCompanyLogo(img);
              }}
              alt={assets.userImg}
              altClass={cn(`object-contain`)}
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
            className={cn(`max-w-11!`)}
            containerCls="min-h-0"
          />
        </div>

        <CustomInput
          control={control}
          name="businessPhoneNo"
          fieldName="Phone"
          inptType="phone"
          placeholder="4567985542"
        />
      </div>

      <Separator className={`bg-separator`} />

      <PostCodeSelectComboBox
        addressSetter={(address) => {
          setValue("city", address.city);
          setValue("country", address.country);
          setValue("postCode", address.postcode);
          setValue("street", address.address_line_1);

          clearErrors(["city", "country", "postCode", "street"]);
        }}
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
        className={cn(`max-w-11! `)}
        containerCls="min-h-0"
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
        isSubmitting={companyUpdateMutation.isPending}
        onClick={handleSubmit(submitHandler)}
      />
    </div>
  );
}

export default BusinessInfoPage;
