import type { RouteObject } from "react-router";
import { AuthHeader } from "../components/auth/auth.header";
import { SignInPage } from "../pages/auth/signIn.page";
import { SignupPage } from "../pages/auth/signUp.page";
import { UnverifiedEmail } from "../pages/auth/unverified.mail";
import { EmailVerified } from "../pages/auth/email.verified";
import { PasswordResetPage } from "../pages/auth/reset.password";
import { ForgotPasswordPage } from "../pages/auth/forgotPassword.page";
import { ProfileSetupPage } from "../pages/auth/profile.setup.page";
import { BusinessProfileForm } from "../pages/auth/BusinessProfileForm";

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: AuthHeader,
    children: [
      {
        index: true,
        Component: SignInPage,
      },
      {
        path: "signup",
        Component: SignupPage,
      },
      {
        path: "email-verification",
        Component: UnverifiedEmail,
      },
      {
        path: "email-verified",
        Component: EmailVerified,
      },
      {
        path: "password-reset",
        Component: PasswordResetPage,
      },
      {
        path: "forgot-password",
        Component: ForgotPasswordPage,
      },
      {
        path: "profile-setup",
        Component: ProfileSetupPage,
      },
      {
        path: "business-profile",
        Component: BusinessProfileForm,
      },
    ],
  },
];
