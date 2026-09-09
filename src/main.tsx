import { createRoot } from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <TooltipProvider>
    <App />
    <ToastContainer />
  </TooltipProvider>,
);
