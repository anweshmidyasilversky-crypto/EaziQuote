import type { RouteObject } from "react-router";
import { AuthHeader } from "../components/auth/auth.header";
import { SignInPage } from "../pages/auth/SigninPage";
import { SignupPage } from "../pages/auth/SignupPage";
import { UnverifiedEmail } from "../pages/auth/UnverifiedMail";
import { EmailVerified } from "../pages/auth/EmailVerified";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { ProfileSetupPage } from "../pages/auth/ProfileSetupPage";
import { BusinessProfileForm } from "../pages/auth/BusinessProfileForm";
import { BusinessAddressForm } from "../pages/auth/BusinessAddressForm";
import { createElement } from "react";
import { ProfileCreateGuard } from "../guards/profileCreateGuard";
import { AuthGuard } from "../guards/authGuard";
import { PublicOnlyGuard } from "../guards/publicOnlyGuard";

export const authRoutes: RouteObject[] = [
  {
    path: "/",
    Component: AuthHeader,
    children: [
      {
        element: createElement(PublicOnlyGuard),
        children: [
          {
            index: true,
            Component: SignInPage,
          },
          {
            path: "/signup",
            Component: SignupPage,
          },
          {
            path: "/forgot-password",
            Component: ForgotPasswordPage,
          },
        ],
      },
      {
        element: createElement(AuthGuard),
        children: [
          {
            path: "email-verification",
            Component: UnverifiedEmail,
          },
          {
            path: "email-verified",
            Component: EmailVerified,
          },

          {
            element: createElement(ProfileCreateGuard),
            children: [
              {
                path: "/profile-setup",
                Component: ProfileSetupPage,
              },
              {
                path: "/business-profile",
                Component: BusinessProfileForm,
              },
              {
                path: "/business-address",
                Component: BusinessAddressForm,
              },
            ],
          },
        ],
      },
    ],
  },
];
