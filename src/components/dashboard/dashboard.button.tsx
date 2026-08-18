export type DashboardButtonProps = {
  leftIcon: string;
  buttonLabel: string;
  clickHandler: () => void;
  currActive: string;
  id: string;
  toggleActive: (val: React.SetStateAction<string>) => void;
};

export function DashboardButton({
  leftIcon,
  buttonLabel,
  clickHandler,
  currActive,
  id,
  toggleActive,
}: DashboardButtonProps) {
  return (
    <button
      onClick={() => {
        toggleActive(id);
        clickHandler();
      }}
      className={`rounded-[7px] w-30 md:w-51 h-10 flex py-2 px-3 gap-3 ${currActive === id ? "bg-sidebar-btn" : ""} flex items-center`}
    >
      <img src={leftIcon} className="h-6 w-6" />
      <span
        className={`font-medium font-sans text-[12px] md:text-4 h-4.75 max-w-30 ${currActive === id ? "text-white" : "text-inactive-btn"}`}
      >
        {" "}
        {buttonLabel}{" "}
      </span>
    </button>
  );
}
