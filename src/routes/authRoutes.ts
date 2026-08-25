import type { RouteObject } from "react-router";
import { AuthLayout } from "../components/auth/AuthLayout";
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
import { DashboardIndexPage } from "../pages/dashboard/DashboardIndexPage";
import { ClientIndexPage } from "../pages/clients/ClientIndexPage";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { ClientDetailsPage } from "../pages/clients/ClientDetailsPage";
import { QuotesIndexPage } from "../pages/quotes/QuotesIndexPage";
import { QuotesDetailsPage } from "../pages/quotes/QuotesDetailsPage";

export const authRoutes: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        element: createElement(AuthGuard),
        children: [
          {
            element: createElement(AuthLayout),
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
                path: "forgot-password",
                Component: ForgotPasswordPage,
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
                element: createElement(ProfileCreateGuard),
                children: [
                  {
                    path: "profile-setup",
                    Component: ProfileSetupPage,
                  },
                  {
                    path: "business-profile",
                    Component: BusinessProfileForm,
                  },
                  {
                    path: "business-address",
                    Component: BusinessAddressForm,
                  },
                ],
              },
            ],
          },

          {
            element: createElement(DashboardLayout),
            children: [
              {
                path: "dashboard",
                Component: DashboardIndexPage,
              },
              {
                path: "clients",
                Component: ClientIndexPage,
              },
              {
                path: "clients/:id",
                Component: ClientDetailsPage,
              },
              {
                path: "quotes",
                Component: QuotesIndexPage,
              },
              {
                path: "quotes/:id",
                Component: QuotesDetailsPage,
              },
            ],
          },
        ],
      },
    ],
  },
];
