export interface ResetPassword {
  newPassword: string;
  confirmPassword: string;
}

export interface UpdatePassword extends ResetPassword {
  currPassword: string;
}
