import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../redux/store";

export function PublicOnlyGuard() {
  const user = useAppSelector((state) => state.user);
  if (user.email.length >= 1) {
    return <Navigate to={"/dashboard"} replace={true} />;
  }
  return <Outlet />;
}
