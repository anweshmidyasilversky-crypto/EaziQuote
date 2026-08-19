import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../redux/store";

export function AuthGuard() {
  const user = useAppSelector((state) => state.user);
  const location = useLocation();
  const publicOnlyRoutes = ["/", "/signup", "/forgot-password"];

  if (publicOnlyRoutes.includes(location.pathname)) {
    if (user.email.length >= 1) {
      return <Navigate to={"/profile-setup"} replace={true} />;
    }
  } else {
    if (user.email.length == 0) {
      return <Navigate to={"/"} replace={true} />;
    }
  }

  return <Outlet />;
}
