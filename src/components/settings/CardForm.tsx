import { useForm } from "react-hook-form";
import CustomDialog from "../common/CustomDialog";
import { type Card } from "@/types/cardDetails.payload.type";
import { CustomInput } from "../common/customInput";
import { CustomCombobox } from "../common/CustomCombobox";
import { countryStates } from "@/constants/dummyData";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { cardSchema } from "@/validation/cardDetails.schema";

export type CardFormProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  submitAction?: () => void;
};

function CardForm({ isOpen, toggleIsOpen, submitAction }: CardFormProps) {
  const {
    control,
    reset,
    clearErrors,
    setValue,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<Card>({
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      country: "",
      state: "",
    },
    resolver: yupResolver(cardSchema),
  });

  const submitHandler = (data: Card) => {
    toast.success(`Sucessfully added card`);
    submitAction?.();
    console.log(data);
    toggleIsOpen(false);
  };

  return (
    <CustomDialog
      dialogOpen={isOpen}
      toggleDialogOpen={toggleIsOpen}
      header="Update Payment Details"
      showFooterSeparator={false}
      withFooter={true}
      footerBtnLabel={"Save Details"}
      closeOnSubmit={false}
      xIconAction={reset}
      footerBtnAction={handleSubmit(submitHandler)}
    >
      <div className="p-5 flex flex-col gap-4 max-w-125">
        <CustomInput
          control={control}
          name="cardNumber"
          fieldName="Card Number"
          inptType="text"
          placeholder="Card number"
        />

        <div className="flex items-center gap-4">
          <CustomInput
            control={control}
            name="expiryDate"
            fieldName="Expiry Date (MM/YY)"
            inptType="text"
            textInputFormatter={(val) => {
              if (val.length >= 4) {
                return val.slice(0, 5);
              }
              if (val.length > 2) {
                if (!val.includes("/")) {
                  return `${val.slice(0, 2)}/${val.slice(2)}`;
                }
              }
              return val;
            }}
            placeholder="Expiry date"
          />

          <CustomInput
            control={control}
            name="cvc"
            fieldName="Security Code (CVC)"
            inptType="text"
            placeholder="Security code"
          />
        </div>

        <div className="flex flex-col gap-2 items-start">
          <label className="input-label"> Country </label>
          <CustomCombobox
            items={Object.keys(countryStates)}
            onValueChange={(val) => {
              if (val) {
                setValue("country", val);
                clearErrors("country");
              }
            }}
            getItemLabel={(val) => val ?? ""}
            placeholder="Country"
            className={cn(`${errors.country ? `input-error` : ``}`)}
          />
          {errors.country && (
            <p className="error-text"> {errors.country.message} </p>
          )}
        </div>

        <div className="flex flex-col gap-2 items-start">
          <label className="input-label"> State </label>
          <CustomCombobox
            items={countryStates[watch().country] ?? []}
            onValueChange={(val) => {
              if (val) {
                setValue("state", val);
                clearErrors("state");
              }
            }}
            placeholder="State/Province/Region"
            emptyMessage="Please select a country first"
            getItemLabel={(val) => val ?? ""}
            className={cn(`${errors.state ? `input-error` : ``}`)}
          />
          {errors.state && (
            <p className="error-text"> {errors.state.message} </p>
          )}
        </div>

        <p className="text-placeholder-text text-sm font-medium">
          {
            "NOTE: By proceeding, your payment method will be securely updated for future transactions."
          }
        </p>
      </div>
    </CustomDialog>
  );
}

export default CardForm;
