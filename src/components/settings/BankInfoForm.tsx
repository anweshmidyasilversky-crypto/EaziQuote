import type { BankInfo } from "@/types/bankInfo.payload";
import { bankInfoSchema } from "@/validation/bankInfo.payload.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomInput } from "../common/customInput";
import { Separator } from "../ui/separator";
import { CustomBtn } from "../common/CustomBtn";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/store";
import { updateUser } from "@/redux/slices/user.slice";

export type BankInfoFormProps = {
  defaultValues?: BankInfo;
  submitAction: () => void;
};

function BankInfoForm({ defaultValues, submitAction }: BankInfoFormProps) {
  const dispath = useAppDispatch();
  const { control, setValue, handleSubmit } = useForm<BankInfo>({
    resolver: yupResolver(bankInfoSchema),
  });
  const [isSubmitting, toggleIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach((key) => {
        const defKey = key as keyof BankInfo;
        setValue(defKey, defaultValues[defKey]);
      });
    }
  }, [defaultValues]);

  const submitHandler = (data: BankInfo) => {
    toggleIsSubmitting(true);
    console.log(data);
    setTimeout(() => {
      dispath(updateUser({ bankInfo: data, bankInfoAdded: true }));
      toast.success(`Saved Changes`);
      toggleIsSubmitting(false);
      submitAction();
    }, 500);
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
          isSubmitting={isSubmitting}
          onClick={handleSubmit(submitHandler)}
        />
      </div>
    </div>
  );
}

export default BankInfoForm;
