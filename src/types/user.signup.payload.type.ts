import type { UserSignInPayload } from "./user.signIn.payload.type";

export interface UserSignupPayload extends UserSignInPayload {
  confirmPassword: string;
}
