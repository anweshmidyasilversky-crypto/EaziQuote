import * as yup from "yup";
import React from "react";
import CustomDialog from "../common/CustomDialog";
import { useForm, type DefaultValues } from "react-hook-form";
import { type AddDiscountPayload } from "@/types/addDiscount.payload";
import { yupResolver } from "@hookform/resolvers/yup";
import { amountSchema } from "@/validation/addDeposite.payload.schema";
import { CustomInput } from "../common/customInput";
import { CustomBtn } from "../common/CustomBtn";
import { cn } from "@/lib/utils";

export type AddDiscountProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDiscount: React.Dispatch<React.SetStateAction<number | undefined>>;
  defaultValues?: DefaultValues<AddDiscountPayload>;
};

function AddDiscount({
  isOpen,
  toggleIsOpen,
  defaultValues,
  setDiscount,
}: AddDiscountProps) {
  const { control, handleSubmit, reset } = useForm<AddDiscountPayload>({
    defaultValues,
    resolver: yupResolver(
      yup.object({
        discount: amountSchema,
      }),
    ),
  });

  const submitHandler = (data: AddDiscountPayload) => {
    setDiscount(data.discount);
    toggleIsOpen(false);
  };
  return (
    <CustomDialog
      dialogOpen={isOpen}
      toggleDialogOpen={toggleIsOpen}
      header="Add Discount"
      footerBtnAction={handleSubmit(submitHandler)}
      footerBtnLabel="Save Discount"
      closeOnSubmit={false}
      footerRightNode={
        <CustomBtn
          btncls={cn(`bg-custom-dialog-primary hover:bg-custom-dialog-primary`)}
          buttonLabel="Clear"
          onClick={reset}
        />
      }
      withFooter
    >
      <div className="p-5 min-w-125">
        <CustomInput
          control={control}
          name="discount"
          fieldName="Discount"
          inptType="number"
          placeholder="e.g. 10"
        />
      </div>
    </CustomDialog>
  );
}

export default AddDiscount;
