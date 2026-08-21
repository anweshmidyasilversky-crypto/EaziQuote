import { XIcon } from "lucide-react";
import type { ClientCreationPayload } from "../../types/clientCreation.payload.type";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { clientCreationSchema } from "../../validation/clientCreation.payload.schema";
import { CustomInput } from "../common/CustomInput";
import { Separator } from "../ui/separator";
import { getAddress } from "../../lib/utils";
import {
  postalCodes,
  type AddressDetail,
  type ClientDataWithFilters,
} from "../../constants/dummyData";
import { PostCodeSelectComboBox } from "../common/PostCodeSelectComboBox";
import React, { useState } from "react";
import { CustomBtn } from "../common/CustomBtn";
import { nanoid } from "@reduxjs/toolkit";

export type ClientCreationFormProps = {
  setClientData: React.Dispatch<React.SetStateAction<ClientDataWithFilters[]>>;
  isFormOpen: boolean;
  formCloseAction?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ClientCreationForm({
  setClientData,
  isFormOpen,
  formCloseAction,
}: ClientCreationFormProps) {
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

  const { control, setValue, clearErrors, handleSubmit } =
    useForm<ClientCreationPayload>({
      defaultValues: initialValue,
      resolver: yupResolver(clientCreationSchema),
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

  const submitHandler = (data: ClientCreationPayload) => {
    toggleIsSubmitting(true);
    const { name: client, companyName: company } = data;
    const newClient: ClientDataWithFilters = {
      id: nanoid(),
      ...data,
      client,
      company,
      createdAt: new Date().toISOString(),
      activityCount: 0,
    };
    setClientData((curr) => [...curr, newClient]);
    toggleIsSubmitting(false);
    formCloseAction?.((curr) => !curr);
  };

  return (
    <>
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30">
          <div className="flex min-h-screen py-8 justify-center">
            <div className="w-[calc(100%-2rem)] max-w-125 h-fit bg-white opacity-100 rounded-[7px]">
              {/* Modal */}
              <div className="flex flex-col gap-6 w-full">
                {/* Header */}
                <div className="flex justify-between p-5 min-h-14.75 bg-table-head rounded-[7px] overflow-hidden">
                  <span className="font-medium text-[16px] min-h-4.75">
                    {" "}
                    Add Client{" "}
                  </span>
                  <button
                    className="md:w-4 md:h-4"
                    onClick={() => formCloseAction?.((curr) => !curr)}
                  >
                    <XIcon className="shimmer-color-muted" />
                  </button>
                </div>

                {/* Form fields */}
                <div className="flex flex-col w-full px-5 gap-4 justify-center items-center">
                  <CustomInput
                    control={control}
                    name="name"
                    fieldName="Client Name"
                    inptType="text"
                    placeholder="Full name"
                    className="md:max-w-115"
                  />

                  <CustomInput
                    control={control}
                    name="companyName"
                    fieldName="Company Name"
                    inptType="text"
                    placeholder="Company name"
                    className="md:max-w-115"
                  />

                  <CustomInput
                    control={control}
                    name="phone"
                    fieldName="Phone"
                    inptType="text"
                    placeholder="Phone number"
                    className="md:max-w-115"
                  />

                  <CustomInput
                    control={control}
                    name="email"
                    fieldName="Email"
                    inptType="text"
                    placeholder="Email address"
                    className="md:max-w-115"
                  />

                  <Separator className={"bg-client-creation-secondary"} />

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
                    className="md:max-w-115"
                  />

                  <CustomInput
                    control={control}
                    name="city"
                    fieldName="City"
                    inptType="text"
                    placeholder="City"
                    className="md:max-w-115"
                  />

                  <CustomInput
                    control={control}
                    name="postCode"
                    fieldName="Postcode"
                    inptType="text"
                    placeholder="Postcode"
                    className="md:max-w-115"
                  />

                  <CustomInput
                    control={control}
                    name="country"
                    fieldName="Country"
                    inptType="text"
                    placeholder="Country"
                    className="md:max-w-115"
                  />
                </div>

                {/* Form footer */}
                <div className="px-5 pb-5">
                  <div className="w-fit max-w-25">
                    <CustomBtn
                      buttonLabel="Save Client"
                      withSpinner={true}
                      isSubmitting={isSubmitting}
                      onClick={handleSubmit(submitHandler)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
