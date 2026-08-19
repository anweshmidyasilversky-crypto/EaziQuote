import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../redux/store";

export function ProfileCreateGuard() {
  const user = useAppSelector((state) => state.user);
  const location = useLocation();

  const steps = [
    {
      completed: user.isUserProfileCreated,
      path: "/profile-setup",
    },
    {
      completed: user.isBusinessProfileCreated,
      path: "/business-profile",
    },
    {
      completed: user.isBusinessAddressProvided,
      path: "/business-address",
    },
  ];

  const nextStep = steps.find((step) => !step.completed);

  console.log(nextStep);

  if (nextStep) {
    if (location.pathname !== nextStep.path) {
      return <Navigate to={nextStep.path} replace={true} />;
    }
  } else {
    return <Navigate to={"/dashboard"} replace={true} />;
  }

  return <Outlet />;
}
