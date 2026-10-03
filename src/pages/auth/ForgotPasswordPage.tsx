import { toast } from "react-toastify";
import { showFirebaseError } from "../../lib/firebase.errors";
import { useNavigate } from "react-router";
import { CustomForm } from "../../components/auth/CustomForm";
import type { CustomInputProps } from "../../components/common/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailSchema } from "../../validation/user.signIn.payload.schema";
import useAuthMutation from "@/hooks/apis/auth/useAuthMutation";
import { showErrorToast } from "@/api/axiosInstance";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { passwordResetMutation } = useAuthMutation();

  const submitHandler = async (data: { email: string }) => {
    passwordResetMutation.mutate(data, {
      onSuccess: (response) => {
        toast.success(response.message);
        navigate("/");
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const fileds: Omit<CustomInputProps<{ email: string }>, "control">[] = [
    {
      name: "email",
      fieldName: "Email",
      placeholder: "Enter your email",
    },
  ];

  return (
    <CustomForm
      title="Forgot Password?"
      description="No worries! Just enter your email, and we’ll help you reset your password."
      defaultValues={{ email: "" }}
      fields={fileds}
      submitHandler={submitHandler}
      buttonLabel="Send Now"
      resolver={yupResolver(emailSchema)}
      isPending={passwordResetMutation.isPending}
    />
  );
}
