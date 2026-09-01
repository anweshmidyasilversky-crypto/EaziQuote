import React, { useState } from "react";
import CustomDialog from "../common/CustomDialog";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "../common/CustomToggleGroup";
import { CustomInput } from "../common/CustomInput";
import { useForm } from "react-hook-form";
import {
  PaymentMethods,
  type AddDepositePayload,
} from "../../types/addDeposite.payload.type";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  amountSchema,
  paymentMethodSchema,
  percentageSchema,
} from "../../validation/addDeposite.payload.schema";
import { cn, formatCurrency } from "../../lib/utils";
import { CustomCombobox } from "../common/CustomCombobox";
import { CustomBtn } from "../common/CustomBtn";

export type AddDepositeProps = {
  isOpen: boolean;
  toggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  totalAmount: number;
  setDeposite: React.Dispatch<React.SetStateAction<number | undefined>>;
};

function AddDeposite({
  isOpen,
  toggleOpen,
  totalAmount,
  setDeposite,
}: AddDepositeProps) {
  enum toggleBtn {
    fixed = "fixed",
    percentage = "percentage",
  }
  const toggleBtnConfig: CustomToggleGroupProps["toggleConfig"] = [
    {
      btnId: toggleBtn.fixed,
      btnLabel: "Fixed (£)",
    },
    {
      btnId: toggleBtn.percentage,
      btnLabel: "Percentage (%)",
    },
  ];
  const [activeToggle, toggleActive] = useState(toggleBtn.fixed);

  const {
    control,
    watch,
    formState: { errors },
    setValue,
    reset,
    handleSubmit,
  } = useForm<AddDepositePayload>({
    defaultValues: {
      paymentMethod: PaymentMethods.stripe,
    },
    resolver: yupResolver(
      yup.object({
        deposite:
          activeToggle === toggleBtn.fixed ? amountSchema : percentageSchema,
        paymentMethod: paymentMethodSchema,
      }),
    ),
  });

  const submitHanler = (data: AddDepositePayload) => {
    if (activeToggle === toggleBtn.percentage) {
      setDeposite((totalAmount * data.deposite) / 100);
    } else {
      setDeposite(data.deposite);
    }
    reset();
  };

  return (
    <CustomDialog
      dialogOpen={isOpen}
      toggleDialogOpen={toggleOpen}
      header="Add Deposite"
      withFooter
      footerBtnLabel="Add Deposite"
      footerBtnAction={handleSubmit(submitHanler)}
      footerRightNode={
        <CustomBtn
          buttonLabel="clear"
          btncls={cn(`bg-custom-dialog-primary text-black-text`)}
          onClick={reset}
        />
      }
    >
      <div className="flex flex-col gap-4">
        {/* Deposite select toggle */}
        <div className="flex flex-col gap-2">
          <span> Deposite Type </span>
          <div className="border rounded-[7px] p-1.5 border-input-field-border">
            <CustomToggleGroup
              toggleActive={
                toggleActive as React.Dispatch<React.SetStateAction<string>>
              }
              activeId={activeToggle}
              toggleConfig={toggleBtnConfig}
            />
          </div>
        </div>

        {/* Form fields */}
        <div className="flex w-full flex-col gap-2">
          <CustomInput
            control={control}
            inptType="number"
            name="deposite"
            fieldName={
              activeToggle === toggleBtn.fixed ? "Amount" : "Percentage"
            }
            placeholder={activeToggle === toggleBtn.fixed ? "£ 0.00" : "% 0.00"}
          />
          {activeToggle === toggleBtn.percentage &&
            errors.deposite === undefined && (
              <span className="text-xs text-placeholder-text">
                {" "}
                {`= ${formatCurrency((totalAmount * watch().deposite) / 100)} of ${formatCurrency(totalAmount)} grand total`}{" "}
              </span>
            )}
        </div>

        <div className="flex flex-col w-full gap-2">
          <CustomCombobox
            items={Object.values(PaymentMethods)}
            selected={PaymentMethods.stripe}
            onValueChange={(method) =>
              method ? setValue("paymentMethod", method) : undefined
            }
          />
          {watch().paymentMethod === PaymentMethods.cash && (
            <span className="text-warning-text text-wrap wrap-break-word text-xs">
              {" "}
              {`You are about to record a cash payment. Please ensure the amount has been physically received before proceeding.`}{" "}
            </span>
          )}
        </div>
      </div>
    </CustomDialog>
  );
}

export default AddDeposite;
