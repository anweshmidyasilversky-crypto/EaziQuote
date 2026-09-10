import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useForm } from "react-hook-form";
import { type BusinessAddressPayload } from "../../types/businessAddress.payload.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { businessAddressSchema } from "../../validation/businessAddress.payload.schema";
import { CustomInput } from "../../components/common/customInput";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { updateUser } from "../../redux/slices/user.slice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { addBusinessAddress } from "@/api/user.api";
import { showErrorToast } from "@/api/axiosInstance";
import { CustomBtn } from "@/components/common/CustomBtn";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { getAddressList } from "@/api/address.api";
import { CustomCombobox } from "@/components/common/CustomCombobox";
import type { AddressDetails } from "@/types/api.responses.type";

export function BusinessAddressForm() {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("M11AE");
  const debouncedSearchTerm = useDebounce({ value: searchTerm });

  const { data: addressList } = useQuery({
    queryKey: ["address", debouncedSearchTerm],
    queryFn: () => getAddressList(debouncedSearchTerm),
  });

  const { mutateAsync: addCompanyAddress } = useMutation({
    mutationKey: ["companyAddress"],
    mutationFn: (data: FormData) => addBusinessAddress(data),
  });

  const { control, setValue, handleSubmit, clearErrors } =
    useForm<BusinessAddressPayload>({
      defaultValues: {
        postCode: user.company?.address?.postcode ?? " ",
        street: user.company?.address?.address ?? " ",
        city: user.company?.address?.city ?? "",
        country: user.company?.address?.country ?? "",
      },
      resolver: yupResolver(businessAddressSchema),
    });

  const setAddress = (address: AddressDetails) => {
    setValue("city", address.city);
    setValue("country", address.country);
    setValue("postCode", address.postcode);
    setValue("street", address.address_line_1 ?? address.district);
    clearErrors();
  };

  const onsubmit = async (data: BusinessAddressPayload) => {
    toggleIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("city", data.city);
      formData.append("country", data.country);
      formData.append("postcode", data.postCode);
      formData.append("address", data.street);
      const companyInfo = await addCompanyAddress(formData);
      dispath(
        updateUser({ is_company_address_setup: true, ...companyInfo.payload }),
      );
      toast.success("Successfully added business address");
      navigate("/dashboard");
    } catch (err) {
      showErrorToast(err);
    } finally {
      toggleIsSubmitting(false);
    }
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
          <CustomCombobox
            items={addressList?.payload ?? []}
            getItemLabel={(addressDetail) => addressDetail?.formatted_address}
            onValueChange={(addressDetail) => {
              if (addressDetail) {
                setAddress(addressDetail);
              }
            }}
            inptFieldValue={searchTerm}
            inptFieldChange={(postCode) => setSearchTerm(postCode)}
          />

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

          <CustomBtn
            buttonLabel="Continue"
            className="btn-auth"
            onClick={handleSubmit(onsubmit)}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
