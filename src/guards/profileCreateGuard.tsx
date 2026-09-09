import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../redux/store";

export function ProfileCreateGuard() {
  const user = useAppSelector((state) => state.user);
  const location = useLocation();

  const steps = [
    {
      completed: user.is_profile_setup,
      path: "/profile-setup",
    },
    {
      completed: user.is_company_profile_setup,
      path: "/business-profile",
    },
    {
      completed: user.is_company_address_setup,
      path: "/business-address",
    },
  ];

  const nextStep = steps.find((step) => !step.completed);
  if (nextStep) {
    if (location.pathname !== nextStep.path) {
      return <Navigate to={nextStep.path} replace={true} />;
    }
  } else {
    return <Navigate to={"/dashboard"} replace={true} />;
  }

  return <Outlet />;
}
