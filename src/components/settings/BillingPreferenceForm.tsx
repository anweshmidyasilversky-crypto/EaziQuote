import type { BillingPreference } from "@/types/billingPreference.payload.type";
import { useEffect, useState } from "react";
import { CustomCombobox } from "../common/CustomCombobox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { billingPreferenceSchema } from "@/validation/billingPreference.payload.schema";
import { cn } from "@/lib/utils";
import { CustomInput } from "../common/CustomInput";
import { CustomBtn } from "../common/CustomBtn";
import { useAppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import type { Vat } from "@/types/api.responses.type";
import useAuthMutation from "@/hooks/apis/auth/useAuthMutation";
import { updateConfig } from "@/redux/slices/settings.slice";
import { showErrorToast } from "@/api/axiosInstance";

export type BillingPreferenceFormProps = {
  defaultValues?: BillingPreference;
  submitAction: () => void;
  vatSetting: Vat[];
  selectedVat?: Vat;
};

function BillingPreferenceForm({
  defaultValues,
  submitAction,
  vatSetting,
  selectedVat,
}: BillingPreferenceFormProps) {
  const [vatSearchTerm, setVatSearchTerm] = useState(selectedVat?.name ?? "");
  const dispatch = useAppDispatch();
  const {
    control,
    setValue,
    formState: { errors, dirtyFields },
    clearErrors,
    handleSubmit,
    unregister,
  } = useForm<BillingPreference>({
    defaultValues: {
      vatRate: undefined,
    },
    resolver: yupResolver(billingPreferenceSchema),
  });

  const { billingPreferenceMutation } = useAuthMutation();

  const submitHandler = (data: BillingPreference) => {
    billingPreferenceMutation.mutate(
      {
        vat_id: data.vatRate,
        quote_expiration: data.quoteExpiry,
        payment_expiration: data.paymentTerms,
      },
      {
        onSuccess: (response) => {
          dispatch(updateConfig(response.payload));
          toast.success(response.message);
          submitAction?.();
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach((key) => {
        const defKey = key as keyof BillingPreference;
        setValue(defKey, defaultValues[defKey]);
      });
    }
  }, [defaultValues]);

  return (
    <div className="p-5 pt-0 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="input-label self-start">
          {" "}
          {"Default VAT Rate (%)"}{" "}
        </label>
        <CustomCombobox
          items={vatSetting}
          getItemLabel={(vat) => vat.name ?? null}
          onValueChange={(vat) => {
            if (vat) {
              setValue("vatRate", vat.id);
              clearErrors("vatRate");
            }
          }}
          className={cn(`${errors.vatRate ? `input-error!` : `input-field`} `)}
          placeholder="Select a vat rate"
          selected={selectedVat}
          inptFieldValue={vatSearchTerm}
          inptFieldChange={(query) => {
            if (dirtyFields.vatRate) {
              unregister("vatRate");
            }
            setVatSearchTerm(query);
          }}
          filterFn={(vat, query) => {
            return Object.values(vat).some((val) =>
              String(val)
                .toLocaleLowerCase()
                .includes(query.toLocaleLowerCase()),
            );
          }}
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
        isSubmitting={billingPreferenceMutation.isPending}
      />
    </div>
  );
}

export default BillingPreferenceForm;
