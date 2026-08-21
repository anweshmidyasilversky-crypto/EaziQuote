import { toast } from "react-toastify";
import { showFirebaseError } from "../../lib/firebase.errors";
import { passwordResetMail } from "../../lib/firebaseAuth";
import { useNavigate } from "react-router";
import { CustomForm } from "../../components/auth/CustomForm";
import type { CustomInputProps } from "../../components/common/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailSchema } from "../../validation/user.signIn.payload.schema";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const submitHandler = async (data: { email: string }) => {
    try {
      await passwordResetMail(data.email);
      toast("Mailed password reset link to entered email", { type: "success" });
      navigate("/");
    } catch (err) {
      showFirebaseError(err);
    }
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
    />
  );
}
