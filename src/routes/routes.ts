import { createElement } from "react";
import type { RouteObject } from "react-router";
import { AuthHeader } from "../components/auth/auth.header";
import { SignInPage } from "../pages/signIn.page";
import { SignupPage } from "../pages/signUp.page";

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
    ],
  },
];
