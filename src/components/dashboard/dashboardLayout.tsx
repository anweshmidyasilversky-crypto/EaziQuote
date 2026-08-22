import { assets } from "../../assets/icons";
import { Outlet, useNavigate } from "react-router";
import { DashboardSidebarButton } from "./DashboardSidebarButton";
import { useState } from "react";
import { useAppSelector } from "../../redux/store";
import { CustomAvatar } from "../common/CustomAvatar";
export function DashboardLayout() {
  const [activeBtn, toggleActiveBtn] = useState<string>("dashboard");
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const endDate = new Date(user.endDate);
  const btnIcon = (btnId: string, activeIcon: string, inActiveIcon: string) =>
    btnId === activeBtn ? activeIcon : inActiveIcon;
  const btnConfig: {
    id: string;
    label: string;
    activeBtn: string;
    inactiveBtn: string;
    clickHandler?: () => void;
  }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      activeBtn: assets.dashboardHomeActiveIcon,
      inactiveBtn: assets.dashboardHomeIcon,
      clickHandler: () => navigate("/dashboard"),
    },
    {
      id: "quotes",
      label: "Quotes",
      activeBtn: assets.quotesActiveIcon,
      inactiveBtn: assets.quotesIcon,
    },
    {
      id: "invoices",
      label: "Invoices",
      activeBtn: assets.invoiceActiveIcon,
      inactiveBtn: assets.invoiceIcon,
    },
    {
      id: "clients",
      label: "Clients",
      activeBtn: assets.clientActiveIcon,
      inactiveBtn: assets.clientIcon,
      clickHandler: () => {
        navigate("/clients");
      },
    },
    {
      id: "payments",
      label: "Payments",
      activeBtn: assets.poundActiveIcon,
      inactiveBtn: assets.poundIcon,
    },
    {
      id: "preset-quotes",
      label: "Preset Quotes",
      activeBtn: assets.presetQuotesActiveIcon,
      inactiveBtn: assets.presetQuotesIcon,
    },
    {
      id: "settings",
      label: "Settings",
      activeBtn: assets.settingsActiveIcon,
      inactiveBtn: assets.settingsIcon,
    },
  ];
  return (
    <div className="w-full h-full flex">
      <div className="bg-sidebar md:w-75 max-w-75 h-screen border-r-sidebar-border border-r-[0.5px]">
        <div className="flex justify-center items-center mb-10">
          <img src={assets.sidebarLogo} className="h-6 mt-6 md:max-w-32.5" />
        </div>

        <div className="flex flex-col gap-5 justify-center items-center">
          {btnConfig.map((btn) => {
            return (
              <DashboardSidebarButton
                key={btn.id}
                id={btn.id}
                toggleActive={toggleActiveBtn}
                currActive={activeBtn}
                leftIcon={btnIcon(btn.id, btn.activeBtn, btn.inactiveBtn)}
                clickHandler={btn.clickHandler}
                buttonLabel={btn.label}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col w-full h-ull overflow-y-auto">
        <div className="w-full border-b-sidebar-border border-b-[0.5px] h-17.5 flex items-center px-6">
          {/* Header content spaced between */}
          <div className="w-full flex justify-between items-center">
            {/* Subscription end detail */}
            <div className="w-80.25 min-h-8 flex gap-3 items-center">
              <span className="max-h-4.75 w-auto max-w-53 font-sans text-xs md:text-sm text-placeholder-text">
                {`${user.isSubscribed ? "Plan" : "Free trial"} ends on ${endDate.toLocaleString("en-Gb", { dateStyle: "medium" })}`}
              </span>

              <button className="btn-auth flex items-center justify-center h-full min-h-8 md:min-w-24.25 md:max-w-24.25 py-2 px-3 gap-2 rounded-0.5 bg-sidebar-btn">
                <span className="font-sans text-sm">Subscribe</span>
                <img src={assets.arrowRight} className="max-h-2 max-w-1" />
              </button>
            </div>

            {/* Logged in user */}
            <div className="h-full w-auto max-w-67.5 flex gap-6 items-center">
              <div className="flex items-center max-h-10">
                <button className="h-10 w-10 flex items-center">
                  <img src={assets.headphoneIcon} className="w-4 h-5" />
                </button>

                <button className="h-10 w-10 flex items-center">
                  <img src={assets.bellIcon} className="h-4.5 w-4" />
                </button>
              </div>

              <div className="flex p-4.5 gap-3 items-center bg-header-user-det overflow-hidden">
                <CustomAvatar src={assets.userImg} fallback="U" />
                <span className="font-sans font-medium text-[14px] min-h-4.25 max-w-21.5 text-wrap">
                  {" "}
                  Matt Potts{" "}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dashboard w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
