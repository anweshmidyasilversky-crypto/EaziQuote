import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../redux/store";
import { PUBLIC_ONLY_ROUTES } from "@/constants/routes";

export function AuthGuard() {
  const user = useAppSelector((state) => state.user);
  const auth = useAppSelector((state) => state.auth);
  const location = useLocation();
  const pendingVerificationEmail = (location.state as { email?: string } | null)
    ?.email;
  const profileSetupRoutes = [
    "/profile-setup",
    "/business-profile",
    "/business-address",
  ];
  const authenticatedLanding = user.is_company_address_setup
    ? "/dashboard"
    : "/profile-setup";

  if (location.pathname === "/email-verified") {
    return <Outlet />;
  }

  if (location.pathname === "/email-verification") {
    if (!auth.apiToken) {
      return pendingVerificationEmail ? (
        <Outlet />
      ) : (
        <Navigate to="/" replace />
      );
    }
    if (user.is_email_verified) {
      return <Navigate to={authenticatedLanding} replace />;
    }
    return <Outlet />;
  }

  if (PUBLIC_ONLY_ROUTES.includes(location.pathname)) {
    if (!auth.apiToken) {
      return <Outlet />;
    }
    if (!user.is_email_verified) {
      return <Navigate to="/email-verification" replace />;
    }
    return <Navigate to={authenticatedLanding} replace />;
  }

  if (auth.apiToken.length <= 0) {
    return <Navigate to="/" replace />;
  }

  if (!user.is_email_verified) {
    return <Navigate to="/email-verification" replace />;
  }

  if (
    !user.is_company_address_setup &&
    !profileSetupRoutes.includes(location.pathname)
  ) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <Outlet />;
}
