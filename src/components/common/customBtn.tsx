export type CustomBtnProps = {
  buttonLabel: string;
  leftIcon?: string;
  onClick?: () => void;
  bgColor?: string;
};

export function CustomBtn({
  buttonLabel,
  leftIcon,
  onClick,
  bgColor,
}: CustomBtnProps) {
  return (
    <button
      className={`h-9 w-fit flex rounded-[7px] py-2 px-4 gap-2.75 items-center btn-auth ${bgColor}`}
      onClick={onClick}
    >
      {leftIcon && <img src={leftIcon} className="h-4 w-4" />}
      <span className="flex flex-none mih-h-[17px] w-fit font-sans font-normal text-[14px] text-nowrap">
        {buttonLabel}
      </span>
    </button>
  );
}
