import { useEffect } from "react";
import { useLocation } from "react-router";

export type DashboardSidebarButtonProps = {
  leftIcon: string;
  buttonLabel: string;
  clickHandler?: () => void;
  currActive: string;
  id: string;
  toggleActive: (val: React.SetStateAction<string>) => void;
};

export function DashboardSidebarButton({
  leftIcon,
  buttonLabel,
  clickHandler,
  currActive,
  id,
  toggleActive,
}: DashboardSidebarButtonProps) {
  const location = useLocation();
  useEffect(() => {
    toggleActive(location.pathname.split("/")[1]);
  }, [location]);

  return (
    <button
      onClick={() => {
        clickHandler?.();
      }}
      className={`rounded-[7px] cursor-pointer max-w-51 w-30 md:w-51 min-h-10 flex py-2 px-3 gap-3 ${currActive === id ? "bg-sidebar-btn " : ""} flex items-center`}
    >
      <img src={leftIcon} className="h-6 w-6" />
      <span
        className={`font-medium font-sans text-[12px] md:text-[16px] h-4.75 max-w-30 min-h-6 ${currActive === id ? "text-white" : "text-inactive-btn"}`}
      >
        {" "}
        {buttonLabel}{" "}
      </span>
    </button>
  );
}
