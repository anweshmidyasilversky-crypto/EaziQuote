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
import { CustomInput } from "../../components/common/CustomInput";
import { useAppDispatch } from "../../redux/store";
import { updateUser } from "../../redux/slices/user.slice";
import { toast } from "react-toastify";
import { showErrorToast } from "@/api/axiosInstance";
import { CustomBtn } from "@/components/common/CustomBtn";
import type { AddressDetails } from "@/types/api.responses.type";
import useUserMutations from "@/hooks/apis/user/useUserMutations";
import { PostCodeSelectComboBox } from "@/components/common/PostCodeSelectComboBox";
import { useNavigate } from "react-router";

export function BusinessAddressForm() {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { comapnyAddressCreateMutation } = useUserMutations();

  const { control, setValue, handleSubmit, clearErrors } =
    useForm<BusinessAddressPayload>({
      defaultValues: {
        postCode: " ",
        street: " ",
        city: "",
        country: "",
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
    comapnyAddressCreateMutation.mutate(data, {
      onSuccess: (response) => {
        dispath(
          updateUser({
            is_company_address_setup: true,
            company: response.payload,
          }),
        );
        toast.success(response.message);
        navigate("/dashboard");
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
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
          <PostCodeSelectComboBox addressSetter={setAddress} />

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
            isSubmitting={comapnyAddressCreateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
