import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useAppSelector } from "../redux/store";
import { useEffect } from "react";

export function ProfileCreateGuard() {
  const user = useAppSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isUserProfileCreated && location.pathname !== "/profile-setup") {
      navigate("/profile-setup", { replace: true });
    } else if (
      !user.isBusinessProfileCreated &&
      location.pathname !== "/business-profile"
    ) {
      navigate("/business-profile", { replace: true });
    } else if (
      !user.isBusinessAddressProvided &&
      location.pathname !== "/business-address"
    ) {
      navigate("/business-address", { replace: true });
    }
  }, []);

  return <Outlet />;
}
