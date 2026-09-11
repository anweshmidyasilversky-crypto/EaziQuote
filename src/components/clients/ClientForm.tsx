import type { ClientCreationPayload } from "../../types/clientCreation.payload.type";
import { useForm, type DefaultValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { clientCreationSchema } from "../../validation/clientCreation.payload.schema";
import { CustomInput } from "../common/customInput";
import { Separator } from "../ui/separator";
import { PostCodeSelectComboBox } from "../common/PostCodeSelectComboBox";
import React, { useEffect, useState } from "react";
import { FormLayout } from "../common/FormLayout";
import { type ClientEditPayload } from "../../types/clientEdit.payload.type";
import type { AddressDetails } from "@/types/api.responses.type";
import { showErrorToast } from "@/api/axiosInstance";

export type ClientFormProps = {
  isFormOpen: boolean;
  toggleFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
  mode: "creation" | "updation";
  clientCreatFn?: (data: ClientCreationPayload) => void | Promise<void>;
  clientEditFn?: (data: ClientEditPayload) => void | Promise<void>;
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
    defaultValues: initialValue,
    resolver: yupResolver(
      mode === "creation"
        ? clientCreationSchema
        : clientCreationSchema.deepPartial(),
    ),
  });

  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).map((objkey) => {
        const key = objkey as keyof ClientCreationPayload;
        setValue(key, defaultValues[key]);
      });
    }
  }, [defaultValues]);

  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const setAddress = (address: AddressDetails) => {
    setValue("street", address.address_line_1);
    setValue("city", address.city);
    setValue("postCode", address.postcode);
    setValue("country", address.country);
    clearErrors(["street", "city", "postCode", "country"]);
  };

  const submitHandler = async (
    data: ClientCreationPayload | ClientEditPayload,
  ) => {
    toggleIsSubmitting(true);
    try {
      if (mode === "creation") {
        await clientCreatFn?.(data as ClientCreationPayload);
      } else {
        await clientEditFn?.(data as ClientEditPayload);
      }
      reset();
      toggleFormOpen(false);
    } catch (err) {
      showErrorToast(err);
    } finally {
      toggleIsSubmitting(false);
    }
  };

  return (
    <>
      {isFormOpen && (
        <FormLayout
          isFormOpen={isFormOpen}
          formHeading={mode === "creation" ? "Add Client" : "Edit Client"}
          sumbitBtnLabel={mode === "creation" ? "Save Client" : "Update Client"}
          formCloseAction={() => {
            toggleFormOpen((curr) => !curr);
            clearErrors();
            reset();
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
              addressSetter={(address) => setAddress(address)}
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
        </FormLayout>
      )}
    </>
  );
}
