import React, { useEffect } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import { FormLayout } from "../common/FormLayout";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  memberCreationSchema,
  type MemberFormValues,
  memberUpdateSchema,
} from "@/validation/memberCreation.schema";
import { toast } from "react-toastify";
import { CustomInput } from "../common/CustomInput";
import useMembersMutation from "@/hooks/apis/members/useMembersMutation";
import type { TeamMember } from "@/types/api.responses.type";
import { showErrorToast } from "@/api/axiosInstance";

export type MemberFormProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "creation" | "updation";
  defaultValues?: DefaultValues<TeamMember>;
  onMutate?: () => void;
};

function MemberForm({
  isOpen,
  toggleIsOpen,
  mode,
  defaultValues,
  onMutate,
}: MemberFormProps) {
  console.log(mode);
  const { memberCreateMutation, memberUpdateMutation } = useMembersMutation();

  const { control, handleSubmit, setValue, clearErrors, reset } =
    useForm<MemberFormValues>({
      defaultValues: {
        name: "",
        email: "",
        password: "",
      },
      resolver: yupResolver(
        mode === "creation" ? memberCreationSchema : memberUpdateSchema,
      ),
    });

  useEffect(() => {
    if (defaultValues) {
      setValue("name", defaultValues.name ?? "");
      setValue("email", defaultValues.email ?? "");
    }
  }, [defaultValues]);

  const submitHandler = (data: MemberFormValues) => {
    if (mode === "updation") {
      let { password, ...patch } = data;
      if (password) {
        patch = Object.assign(patch, {
          password,
        });
      }
      memberUpdateMutation.mutate(
        {
          id: defaultValues?.id ?? 0,
          ...patch,
        },
        {
          onSuccess: (response) => {
            toast.success(response.message);
            toggleIsOpen(false);
            reset();
            onMutate?.();
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    } else {
      memberCreateMutation.mutate(
        {
          name: data.name ?? "",
          email: data.email ?? "",
          password: data.password ?? "",
        },
        {
          onSuccess: (response) => {
            toast.success(response.message);
            toggleIsOpen(false);
            reset();
            onMutate?.();
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    }
  };
  return (
    <FormLayout
      isFormOpen={isOpen}
      formHeading={`${mode === "creation" ? `Add` : `Edit`} Member`}
      isSubmitting={
        memberCreateMutation.isPending || memberUpdateMutation.isPending
      }
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
