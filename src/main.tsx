import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { authRoutes } from "./routes/authRoutes.ts";
import { RouterProvider } from "react-router/dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "react-toastify/dist/ReactToastify.css";
import { persistor, store } from "./redux/store.ts";
import { dashboardRoutes } from "./routes/dashboardRoutes.ts";
import { TooltipProvider } from "./components/ui/tooltip.tsx";

const routes = [...authRoutes, ...dashboardRoutes];

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
      <ToastContainer />
    </PersistGate>
  </Provider>,
);
