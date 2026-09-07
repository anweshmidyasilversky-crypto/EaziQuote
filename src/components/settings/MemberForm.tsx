import type { MemberCreationPayload } from "@/types/memberCreation.payload.type";
import React, { useEffect, useState } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import { FormLayout } from "../common/FormLayout";
import { yupResolver } from "@hookform/resolvers/yup";
import { memberCreationSchema } from "@/validation/memberCreation.schema";
import { toast } from "react-toastify";
import { CustomInput } from "../common/customInput";

export type MemberFormProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "creation" | "updation";
  defaultValues?: DefaultValues<
    MemberCreationPayload | Partial<MemberCreationPayload>
  >;
};

function MemberForm({
  isOpen,
  toggleIsOpen,
  mode,
  defaultValues,
}: MemberFormProps) {
  console.log(defaultValues);
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const { control, handleSubmit, setValue, clearErrors, reset } = useForm<
    MemberCreationPayload | Partial<MemberCreationPayload>
  >({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(
      mode === "creation"
        ? memberCreationSchema
        : memberCreationSchema.deepPartial(),
    ),
  });

  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach((key) => {
        const defKey = key as keyof MemberCreationPayload;
        setValue(key as keyof MemberCreationPayload, defaultValues[defKey]);
      });
    }
  }, [defaultValues]);

  const submitHandler = (
    data: MemberCreationPayload | Partial<MemberCreationPayload>,
  ) => {
    toggleIsSubmitting(true);
    console.log(data);
    toast.success(
      `Successfully ${mode === "creation" ? `added` : `updated`} member`,
    );
    toggleIsSubmitting(false);
    toggleIsOpen(false);
    reset();
  };
  return (
    <FormLayout
      isFormOpen={isOpen}
      formHeading={`${mode === "creation" ? `Add` : `Edit`} Member`}
      isSubmitting={isSubmitting}
      sumbitBtnLabel={`${mode === "creation" ? `Add` : `Update`} Member`}
      submitHanlder={handleSubmit(submitHandler)}
      formCloseAction={() => {
        clearErrors();
        toggleIsOpen((curr) => !curr);
        reset();
      }}
    >
      <div className="w-full flex flex-col gap-6">
        <CustomInput
          control={control}
          name="name"
          fieldName="Name"
          placeholder="Enter name"
        />

        <CustomInput
          control={control}
          name="email"
          fieldName="Email"
          placeholder="Enter email"
        />

        <CustomInput
          control={control}
          name="password"
          fieldName="Password"
          placeholder="Enter password"
        />
      </div>
    </FormLayout>
  );
}

export default MemberForm;
