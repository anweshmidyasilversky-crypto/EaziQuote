import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../redux/store";

export function AuthGuard() {
  const user = useAppSelector((state) => state.user);
  const location = useLocation();
  const publicOnlyRoutes = [
    "/",
    "/signup",
    "/forgot-password",
    "/email-verification",
  ];
  const profileSetupRoutes = [
    "/profile-setup",
    "/business-profile",
    "/business-address",
  ];

  if (publicOnlyRoutes.includes(location.pathname)) {
    if (user.email.length >= 1) {
      return <Navigate to={"/dashboard"} replace={true} />;
      // if (
      //   !user.is_email_verified &&
      //   location.pathname !== "/email-verification"
      // ) {
      //   return <Navigate to={"/email-verification"} replace={true} />;
      // }

      // const nextProfileStep = !user.is_profile_setup
      //   ? "/profile-setup"
      //   : !user.is_company_profile_setup
      //     ? "/business-profile"
      //     : !user.is_company_address_setup
      //       ? "/business-address"
      //       : undefined;

      // if (
      //   user.is_email_verified &&
      //   nextProfileStep &&
      //   location.pathname !== nextProfileStep
      // ) {
      //   return <Navigate to={nextProfileStep} replace={true} />;
      // }
    }
  } else {
    if (user.email.length == 0) {
      if (location.pathname !== "/") {
        return <Navigate to={"/"} replace={true} />;
      }
    } else {
      if (!user.is_company_address_setup) {
        if (!profileSetupRoutes.includes(location.pathname)) {
          return <Navigate to={"/profile-setup"} replace={true} />;
        }
      }
    }
  }

  return <Outlet />;
}
