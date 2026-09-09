import { createBrowserRouter } from "react-router";
import { authRoutes } from "./routes/authRoutes.ts";
import { RouterProvider } from "react-router/dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store.ts";
import { dashboardRoutes } from "./routes/dashboardRoutes.ts";

const routes = [...authRoutes, ...dashboardRoutes];

const router = createBrowserRouter(routes);

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;
