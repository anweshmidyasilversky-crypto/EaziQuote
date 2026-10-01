import { showErrorToast } from "@/api/axiosInstance";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomInput } from "@/components/common/CustomInput";
import useUserMutations from "@/hooks/apis/user/useUserMutations";
import type { PasswordResetPayload } from "@/types/passwordReset.payload.type";
import { passwordResetSchema } from "@/validation/passwordReset.payload.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export type PasswordResetPageProps = {
  defaultValues?: PasswordResetPayload;
};

function ChangePasswordPage({ defaultValues }: PasswordResetPageProps) {
  const { passwordUpdateMutation } = useUserMutations();
  const { control, setValue, handleSubmit, reset } =
    useForm<PasswordResetPayload>({
      resolver: yupResolver(passwordResetSchema),
    });

  const submitHandler = (data: PasswordResetPayload) => {
    passwordUpdateMutation.mutate(
      {
        old_password: data.oldPassword,
        new_password: data.newPassword,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          reset({
            oldPassword: undefined,
            newPassword: undefined,
            confirmPassword: undefined,
          });
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
        const objKey = key as keyof PasswordResetPayload;
        setValue(objKey, defaultValues[objKey]);
      });
    }
  }, [defaultValues]);

  return (
    <>
      <HeaderBreadCrumb pageName="Change Password" />
      <div className="m-6 p-5 flex flex-col gap-8 bg-white rounded-[10px]">
        <CustomInput
          control={control}
          name="oldPassword"
          fieldName="Old Password"
          inptType="password"
          placeholder="Enter old password"
        />
        <CustomInput
          control={control}
          name="newPassword"
          fieldName="New Password"
          inptType="password"
          placeholder="Enter new password"
        />
        <CustomInput
          control={control}
          name="confirmPassword"
          fieldName="Confirm Password"
          inptType="password"
          placeholder="Confirm new password"
        />

        <CustomBtn
          buttonLabel="Change Password"
          onClick={handleSubmit(submitHandler)}
          isSubmitting={passwordUpdateMutation.isPending}
        />
      </div>
    </>
  );
}

export default ChangePasswordPage;
