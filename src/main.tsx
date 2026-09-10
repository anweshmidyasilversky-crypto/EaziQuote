import { createRoot } from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import App from "./App.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <TooltipProvider>
      <App />
      <ToastContainer />
    </TooltipProvider>
  </QueryClientProvider>,
);
