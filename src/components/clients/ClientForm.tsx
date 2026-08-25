import type { ClientCreationPayload } from "../../types/clientCreation.payload.type";
import { useForm, type DefaultValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { clientCreationSchema } from "../../validation/clientCreation.payload.schema";
import { CustomInput } from "../common/CustomInput";
import { Separator } from "../ui/separator";
import { getAddress } from "../../lib/utils";
import { postalCodes, type AddressDetail } from "../../constants/dummyData";
import { PostCodeSelectComboBox } from "../common/PostCodeSelectComboBox";
import React, { useState } from "react";
import { ClientFormLayout } from "./ClientFormLayout";
import { type ClientEditPayload } from "../../types/clientEdit.payload.type";

export type ClientFormProps = {
  isFormOpen: boolean;
  toggleFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
  mode: "creation" | "updation";
  clientCreatFn?: (data: ClientCreationPayload) => void;
  clientEditFn?: (data: ClientEditPayload) => void;
  defaultValues?: DefaultValues<ClientCreationPayload | ClientEditPayload>;
};

export function ClientForm({
  isFormOpen,
  toggleFormOpen,
  mode,
  defaultValues,
  clientCreatFn,
  clientEditFn,
}: ClientFormProps) {
  const initialValue: ClientCreationPayload = {
    name: "",
    phone: "",
    email: "",
    companyName: "",
    street: "",
    city: "",
    postCode: "",
    country: "",
  };

  const { control, setValue, clearErrors, handleSubmit, reset } = useForm<
    ClientCreationPayload | ClientEditPayload
  >({
    defaultValues: defaultValues ?? initialValue,
    resolver: yupResolver(
      mode === "creation"
        ? clientCreationSchema
        : clientCreationSchema.deepPartial(),
    ),
  });
  const [postCode, selectPostCode] = useState<string | null>(null);
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const setAddress = (postCode: string) => {
    const address = getAddress(postCode);
    if (address) {
      Object.keys(address).forEach((addressKey) => {
        const key = addressKey as keyof AddressDetail;
        setValue(key, address[key]);
        clearErrors(key);
      });
    }
  };

  const submitHandler = (data: ClientCreationPayload | ClientEditPayload) => {
    toggleIsSubmitting(true);
    if (mode === "creation") {
      clientCreatFn?.(data as ClientCreationPayload);
    } else {
      clientEditFn?.(data as ClientEditPayload);
    }
    toggleIsSubmitting(false);
    reset(defaultValues ?? initialValue);
    selectPostCode("");
    toggleFormOpen(false);
  };

  return (
    <>
      {isFormOpen && (
        <ClientFormLayout
          isFormOpen={isFormOpen}
          formHeading={mode === "creation" ? "Add Client" : "Edit Client"}
          sumbitBtnLabel={mode === "creation" ? "Save Client" : "Update Client"}
          formCloseAction={() => {
            toggleFormOpen((curr) => !curr);
            clearErrors();
          }}
          isSubmitting={isSubmitting}
          submitHanlder={handleSubmit(submitHandler)}
        >
          {/* Fields */}

          <div className="flex flex-col w-full gap-4 justify-center items-center md:[&_input]:max-w-115">
            <CustomInput
              control={control}
              name={"name"}
              fieldName="Client Name"
              inptType="text"
              placeholder="Full name"
            />

            <CustomInput
              control={control}
              name={"companyName"}
              fieldName="Company Name"
              inptType="text"
              placeholder="Company name"
            />

            <CustomInput
              control={control}
              name={"phone"}
              fieldName="Phone"
              inptType="text"
              placeholder="Phone number"
            />

            <CustomInput
              control={control}
              name={"email"}
              fieldName="Email"
              inptType="text"
              placeholder="Email address"
            />

            <Separator className={`bg-client-creation-secondary`} />

            <PostCodeSelectComboBox
              postCode={postCode}
              postalCodes={postalCodes}
              selectPostCode={selectPostCode}
              addressSetter={setAddress}
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
          </div>
        </ClientFormLayout>
      )}
    </>
  );
}
