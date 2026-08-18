import { House } from "lucide-react";
import { assets } from "../../assets/icons";
import { Outlet } from "react-router";
import dashboardHomeIcon from "../../assets/icons/dashboardHomeIcon.svg?react";
import {
  DashboardButton,
  type DashboardButtonProps,
} from "../dashboard/dashboard.button";
import { useState } from "react";
export function SideBar() {
  const [activeBtn, toggleActiveBtn] = useState<string>("dashboard");
  const btnList: Omit<DashboardButtonProps, "toggleActive" | "currActive">[] = [
    {
      leftIcon: assets.dashboardHomeIcon,
      buttonLabel: "Dashboard",
      id: "dashboard",
      clickHandler: () => {},
    },
    {
      leftIcon: assets.quotesIcon,
      buttonLabel: "Quotes",
      id: "quotes",
      clickHandler: () => {},
    },
    {
      leftIcon: assets.invoiceIcon,
      buttonLabel: "Invoices",
      id: "invoices",
      clickHandler: () => {},
    },
    {
      leftIcon: assets.clientIcon,
      buttonLabel: "Clients",
      id: "clients",
      clickHandler: () => {},
    },
    {
      leftIcon: assets.poundIcon,
      buttonLabel: "Payments",
      id: "payments",
      clickHandler: () => {},
    },
    {
      leftIcon: assets.presentQuotesIcon,
      buttonLabel: "Preset Quotes",
      id: "preset",
      clickHandler: () => {},
    },
    {
      leftIcon: assets.settingsIcon,
      buttonLabel: "Settings",
      id: "settings",
      clickHandler: () => {},
    },
  ];
  return (
    <div className="w-full h-full">
      <div className="bg-sidebar max-w-63 h-full border-r-sidebar-border border-r-[0.5px]">
        <div className="flex justify-center items-center mt-6 mb-10">
          <img src={assets.sidebarLogo} className="h-6 md:max-w-32.5" />
        </div>

        <div className="flex flex-col gap-5 justify-center items-center">
          {btnList.map((btn) => {
            return (
              <DashboardButton
                id={btn.id}
                toggleActive={toggleActiveBtn}
                currActive={activeBtn}
                leftIcon={btn.leftIcon}
                clickHandler={btn.clickHandler}
                buttonLabel={btn.buttonLabel}
              />
            );
          })}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
