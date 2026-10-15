import React, { useEffect, useState } from "react";
import CustomDialog from "../common/CustomDialog";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "../common/CustomToggleGroup";
import { CustomInput } from "../common/CustomInput";
import { useForm, useWatch, type DefaultValues } from "react-hook-form";
import { type AddDepositePayload } from "../../types/addDeposite.payload.type";
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
import { PaymentMethods, StripAccountStatus } from "@/types/api.responses.type";
import { DepositeTypes } from "@/types/api.requests.type";
import { useAppSelector } from "@/redux/store";

export type AddDepositeProps = {
  isOpen: boolean;
  toggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  totalAmount: number;
  setDeposite:
    | React.Dispatch<React.SetStateAction<number | undefined>>
    | ((deposite: number | undefined) => void);
  setPaymentMode:
    | React.Dispatch<React.SetStateAction<PaymentMethods>>
    | ((method: PaymentMethods) => void);
  defaultValues: DefaultValues<AddDepositePayload>;
  handleDepositeType?: (depositeType: DepositeTypes) => void;
  handleDepositePercentage?: (depositePercentage: number) => void;
  toggleStripPopup: React.Dispatch<React.SetStateAction<boolean>>;
  depositeType?: DepositeTypes;
};

function AddDeposite({
  isOpen,
  toggleOpen,
  totalAmount,
  setDeposite,
  setPaymentMode,
  defaultValues,
  handleDepositeType,
  handleDepositePercentage,

  toggleStripPopup,
  depositeType,
}: AddDepositeProps) {
  const user = useAppSelector((state) => state.user);
  const isStripeConnected =
    user.stripe_account_status === StripAccountStatus.active;
  const DepositeTypesConfig: CustomToggleGroupProps["toggleConfig"] = [
    {
      btnId: DepositeTypes.fixed,
      btnLabel: "Fixed (£)",
    },
    {
      btnId: DepositeTypes.percentage,
      btnLabel: "Percentage (%)",
    },
  ];
  const [activeToggle, toggleActive] = useState(
    depositeType ?? DepositeTypes.fixed,
  );
  const [selectedMethod, setSelectedMethod] = useState(
    defaultValues.paymentMethod ?? "",
  );

  const {
    control,
    watch,
    formState: { errors },
    setValue,
    reset,
    handleSubmit,
  } = useForm<AddDepositePayload>({
    defaultValues,

    resolver: yupResolver(
      yup.object({
        deposite:
          activeToggle === DepositeTypes.fixed
            ? amountSchema
            : percentageSchema,
        paymentMethod: paymentMethodSchema,
      }),
    ),
  });

  const [currPaymentMethod] = useWatch({
    control,
    name: ["paymentMethod"],
  });

  const submitHanler = (data: AddDepositePayload) => {
    if (data.paymentMethod === PaymentMethods.stripe && !isStripeConnected) {
      toggleStripPopup(true);
      toggleOpen(false);
    } else {
      handleDepositeType?.(activeToggle);
      if (activeToggle === DepositeTypes.percentage) {
        handleDepositePercentage?.(data.deposite);
        setDeposite((totalAmount * data.deposite) / 100);
      } else {
        setDeposite(data.deposite);
      }
      setPaymentMode(data.paymentMethod);
      toggleActive(DepositeTypes.fixed);
      toggleOpen(false);
    }
  };

  useEffect(() => {
    if (defaultValues.deposite) {
      setValue("deposite", defaultValues.deposite);
    }
    if (defaultValues.paymentMethod) {
      setValue("paymentMethod", defaultValues.paymentMethod);
    }
    toggleActive(depositeType ?? DepositeTypes.fixed);
  }, [isOpen]);

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
          btncls={cn(
            `bg-custom-dialog-primary hover:bg-custom-dialog-primary text-black-text`,
          )}
        />
      }
      closeOnSubmit={false}
    >
      <div className="flex flex-col gap-4 w-125 p-5">
        {/* Deposite select toggle */}
        <div className="flex flex-col gap-2">
          <span> Deposite Type </span>
          <div className="border rounded-[7px] p-1.5 border-input-field-border">
            <CustomToggleGroup
              toggleActive={(toggle) => {
                reset({
                  deposite: "" as any,
                  paymentMethod: currPaymentMethod,
                });
                toggleActive(toggle as DepositeTypes);
              }}
              activeId={activeToggle}
              toggleConfig={DepositeTypesConfig}
              containerCls={cn(`border-0! `)}
              btnCls={cn(`rounded-[5px]! grow`)}
              className={cn(`items-center`)}
            />
          </div>
        </div>

        {/* Form fields */}
        <div className="flex w-full max-w-125 flex-col gap-2">
          <CustomInput
            control={control}
            inptType="number"
            name="deposite"
            fieldName={
              activeToggle === DepositeTypes.fixed ? "Amount" : "Percentage"
            }
            placeholder={
              activeToggle === DepositeTypes.fixed ? "£ 0.00" : "% 0.00"
            }
          />
          {activeToggle === DepositeTypes.percentage &&
            errors.deposite === undefined && (
              <span className="text-xs text-placeholder-text">
                {" "}
                {`= ${formatCurrency((totalAmount * (watch().deposite ?? 0)) / 100)} of ${formatCurrency(totalAmount)} grand total`}{" "}
              </span>
            )}
        </div>

        <div className="flex flex-col w-full gap-2">
          <CustomCombobox
            items={Object.values(PaymentMethods)}
            selected={
              watch("paymentMethod") ??
              (isStripeConnected ? PaymentMethods.stripe : PaymentMethods.cash)
            }
            onValueChange={(method) => {
              method ? setValue("paymentMethod", method) : undefined;
              setSelectedMethod(method ?? "");
            }}
            inptFieldValue={selectedMethod}
            inptFieldChange={(val) => {
              setValue("paymentMethod", val as PaymentMethods);
              setSelectedMethod(val);
            }}
            placeholder="Select a payment method"
            className={cn(
              errors.paymentMethod ? `input-error!` : `input-field!`,
            )}
          />
          {errors.paymentMethod && (
            <p className="error-text"> {errors.paymentMethod.message} </p>
          )}
          {watch("paymentMethod") === PaymentMethods.cash && (
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
