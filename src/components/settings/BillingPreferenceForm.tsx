import type { BillingPreference } from "@/types/billingPreference.payload.type";
import { useEffect, useState } from "react";
import { CustomCombobox } from "../common/CustomCombobox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { billingPreferenceSchema } from "@/validation/billingPreference.payload.schema";
import { cn } from "@/lib/utils";
import { CustomInput } from "../common/customInput";
import { CustomBtn } from "../common/CustomBtn";
import { useAppDispatch } from "@/redux/store";
import { updateUser } from "@/redux/slices/user.slice";
import { toast } from "react-toastify";

export type BillingPreferenceFormProps = {
  defaultValues?: BillingPreference;
  submitAction: () => void;
};

function BillingPreferenceForm({
  defaultValues,
  submitAction,
}: BillingPreferenceFormProps) {
  const vatRates: { value: number; label: string }[] = [
    { value: 0, label: "0% Domestic reverse charge" },
    { value: 11.54, label: "VAT at 11.54%" },
    { value: 20, label: "VAT at 20%" },
    { value: 4, label: "VAT at 4%" },
    { value: 5, label: "VAT at 5%" },
    { value: 0, label: "Zero rated" },
  ];
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const {
    control,
    setValue,
    formState: { errors },
    clearErrors,
    handleSubmit,
  } = useForm<BillingPreference>({
    defaultValues: {
      vatRate: undefined,
    },
    resolver: yupResolver(billingPreferenceSchema),
  });

  const submitHandler = (data: BillingPreference) => {
    toggleIsSubmitting(true);
    setTimeout(() => {
      dispatch(
        updateUser({ billingPref: data, billingPreferenceProvided: true }),
      );
      submitAction();
      toast.success(`Sucessfully saved billing preference`);
    }, 500);
  };

  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach((key) => {
        const defKey = key as keyof BillingPreference;
        setValue(defKey, defaultValues[defKey]);
      });
    }
  }, [defaultValues]);
  console.log(errors.vatRate);

  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="input-label self-start">
          {" "}
          {"Default VAT Rate (%)"}{" "}
        </label>
        <CustomCombobox
          items={vatRates}
          getItemLabel={(item) => item?.label ?? null}
          onValueChange={(item) => {
            if (item) {
              setValue("vatRate", item?.value ?? 0);
              clearErrors("vatRate");
            }
          }}
          className={cn(
            `${errors.vatRate ? `input-error` : `input-field`} readOnly`,
          )}
          placeholder="Select a vat rate"
        />
        {errors.vatRate && (
          <p className="error-text"> {errors.vatRate.message} </p>
        )}
      </div>

      <CustomInput
        control={control}
        name="quoteExpiry"
        fieldName="Quote Expiry (Days)"
        placeholder="30"
      />

      <CustomInput
        control={control}
        name="paymentTerms"
        fieldName="Payment Terms (Days)"
        placeholder="30"
      />

      <CustomBtn
        buttonLabel="Save Changes"
        onClick={handleSubmit(submitHandler)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default BillingPreferenceForm;
