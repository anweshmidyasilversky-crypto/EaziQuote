import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../redux/store";

export function AuthGuard() {
  const user = useAppSelector((state) => state.user);
  const location = useLocation();
  const publicOnlyRoutes = ["/", "/signup", "/forgot-password"];

  if (!publicOnlyRoutes.includes(location.pathname)) {
    if (user.email.length >= 1) {
      if (
        !user.is_email_verified &&
        location.pathname !== "/email-verification"
      ) {
        return <Navigate to={"/email-verification"} replace={true} />;
      }

      const nextProfileStep = !user.is_profile_setup
        ? "/profile-setup"
        : !user.is_company_profile_setup
          ? "/business-profile"
          : !user.is_company_address_setup
            ? "/business-address"
            : undefined;

      if (
        user.is_email_verified &&
        nextProfileStep &&
        location.pathname !== nextProfileStep
      ) {
        return <Navigate to={nextProfileStep} replace={true} />;
      }
    }
  } else {
    if (user.email.length == 0) {
      return <Navigate to={"/"} replace={true} />;
    }
  }

  return <Outlet />;
}
