import type { BankInfo } from "@/types/bankInfo.payload";
import { bankInfoSchema } from "@/validation/bankInfo.payload.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CustomInput } from "../common/CustomInput";
import { Separator } from "../ui/separator";
import { CustomBtn } from "../common/CustomBtn";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/store";
import { updateBillingDetailsRedux } from "@/redux/slices/user.slice";
import useAuthMutation from "@/hooks/apis/auth/useAuthMutation";
import { showErrorToast } from "@/api/axiosInstance";

export type BankInfoFormProps = {
  defaultValues?: BankInfo;
  submitAction: () => void;
};

function BankInfoForm({ defaultValues, submitAction }: BankInfoFormProps) {
  const dispath = useAppDispatch();
  const { control, setValue, handleSubmit } = useForm<BankInfo>({
    resolver: yupResolver(bankInfoSchema),
  });

  const { billingDetailsMutation } = useAuthMutation();

  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach((key) => {
        const defKey = key as keyof BankInfo;
        setValue(defKey, defaultValues[defKey]);
      });
    }
  }, [defaultValues]);

  const submitHandler = (data: BankInfo) => {
    billingDetailsMutation.mutate(
      {
        account_number: data.accNumber,
        name: data.accName,
        bank_name: data.bankName,
        email: data.paymentLink,
        sort_code: data.sortCode,
      },
      {
        onSuccess: (response) => {
          dispath(
            updateBillingDetailsRedux({
              ...response.payload,
              hasBankAccountDetailAdded: true,
            }),
          );
          toast.success(response.message);
          submitAction?.();
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-8 px-5 pb-5">
      <div className="flex flex-col gap-6">
        <span className="font-medium text-sm"> {"Payment Link"} </span>
        <CustomInput
          control={control}
          name="paymentLink"
          fieldName="PayPal, Stripe, or other"
          placeholder="sarah.johnson@paypal.com"
        />
      </div>

      <Separator className={`bg-separator`} />

      <div className="flex flex-col gap-6">
        <span className="font-medium text-sm"> {"Bank Info"} </span>
        <div className="grid grid-cols-2 gap-6">
          <CustomInput
            control={control}
            name="bankName"
            fieldName="Bank Name"
            placeholder="Barclays UK"
          />
          <CustomInput
            control={control}
            name="accName"
            fieldName="Account Name"
            placeholder="Alpha Renovates Pvt. Ltd."
          />
          <CustomInput
            control={control}
            name="accNumber"
            fieldName="Account Number"
            placeholder="65301942"
          />
          <CustomInput
            control={control}
            name="sortCode"
            fieldName="Sort Code"
            placeholder="20-14-60"
          />
        </div>
        <CustomBtn
          buttonLabel="Save Changes"
          isSubmitting={billingDetailsMutation.isPending}
          onClick={handleSubmit(submitHandler)}
        />
      </div>
    </div>
  );
}

export default BankInfoForm;
