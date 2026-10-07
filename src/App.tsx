import { createBrowserRouter } from "react-router";
import { authRoutes } from "./routes/authRoutes.ts";
import { RouterProvider } from "react-router/dom";
import { useAppDispatch, useAppSelector } from "./redux/store.ts";
import { dashboardRoutes } from "./routes/dashboardRoutes.ts";
import useAppConfig from "./hooks/apis/appConfig/useAppConfig.ts";
import { updateConfig } from "./redux/slices/settings.slice.ts";
import { useEffect } from "react";
import useUserDetails from "./hooks/apis/user/useUserDetails.ts";
import { updateUser } from "./redux/slices/user.slice.ts";
import { configureRevenueCat } from "./lib/revenueCat.ts";
import { showErrorToast } from "./api/axiosInstance.ts";

const routes = [...authRoutes, ...dashboardRoutes];

const router = createBrowserRouter(routes);

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const auth = useAppSelector((state) => state.auth);
  const appConfig = useAppConfig({ enabled: auth.apiToken.length >= 1 });

  const { userDetails } = useUserDetails({
    enabled: user.is_company_profile_setup,
  });

  useEffect(() => {
    if (!auth.apiToken) {
      return;
    }
    if (appConfig?.payload) {
      dispatch(updateConfig(appConfig.payload));
    }
    if (userDetails) {
      dispatch(
        updateUser({
          ...userDetails,
          phone: userDetails.phone.replaceAll(" ", ""),
        }),
      );
    }
  }, [auth.apiToken, appConfig?.payload, dispatch, userDetails]);

  useEffect(() => {
    if (!auth.apiToken || user.id <= 0) {
      return;
    }

    void configureRevenueCat(String(user.id)).catch(showErrorToast);
  }, [auth.apiToken, user.id]);

  return <RouterProvider router={router} />;
}

export default App;
