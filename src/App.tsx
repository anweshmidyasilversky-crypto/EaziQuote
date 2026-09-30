import { createBrowserRouter } from "react-router";
import { authRoutes } from "./routes/authRoutes.ts";
import { RouterProvider } from "react-router/dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store, useAppDispatch } from "./redux/store.ts";
import { dashboardRoutes } from "./routes/dashboardRoutes.ts";
import useAppConfig from "./hooks/apis/appConfig/useAppConfig.ts";
import { updateConfig } from "./redux/slices/settings.slice.ts";
import { useEffect } from "react";
import useUserDetails from "./hooks/apis/user/useUserDetails.ts";
import { updateUser } from "./redux/slices/user.slice.ts";

const routes = [...authRoutes, ...dashboardRoutes];

const router = createBrowserRouter(routes);

function App() {
  const dispatch = useAppDispatch();
  const appConfig = useAppConfig();

  const { userDetails } = useUserDetails();

  useEffect(() => {
    if (appConfig?.payload) {
      dispatch(updateConfig(appConfig.payload));
    }
    if (userDetails) {
      userDetails.phone = userDetails.phone.replaceAll(" ", "");
      dispatch(updateUser(userDetails));
    }
  }, [appConfig?.payload, userDetails]);

  return <RouterProvider router={router} />;
}

export default App;
