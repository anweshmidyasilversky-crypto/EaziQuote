import { useParams } from "react-router";
import { CustomForm } from "../../components/auth/CustomForm";
import type { ResetPassword } from "../../types/passwordResetUpdate.type";
import { isPasswordResetCode, resetPassword } from "../../lib/firebaseAuth";
import { showFirebaseError } from "../../lib/firebase.errors";
import type { CustomInputProps } from "../../components/common/customInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../../validation/password.schema";

export function PasswordResetPage() {
  const params = useParams() as {
    mode: string;
    oobCode: string;
  };

  const submitHandler = async (data: ResetPassword) => {
    try {
      await isPasswordResetCode(params.oobCode);
      await resetPassword(params.oobCode, data.newPassword);
    } catch (err) {
      showFirebaseError(err);
    }
  };

  const fields: Omit<CustomInputProps<ResetPassword>, "control">[] = [
    {
      name: "newPassword",
      fieldName: "New Password",
      inptType: "Password",
    },
    {
      name: "confirmPassword",
      fieldName: "confirmPassword",
      inptType: "Password",
    },
  ];

  return (
    <CustomForm
      title="Set a New Password"
      description="Create a new password to secure your EaziQuote account."
      fields={fields}
      submitHandler={submitHandler}
      defaultValues={{
        confirmPassword: "",
        newPassword: "",
      }}
      buttonLabel="Reset Password"
      resolver={yupResolver(resetPasswordSchema)}
    />
  );
}
