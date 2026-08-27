import { Spinner } from "../ui/spinner";
import { Button as ButtonPrimitive } from "@base-ui/react/button";

export type CustomBtnProps = {
  buttonLabel: string;
  leftIcon?: string;
  onClick?: () => void;
  bgColor?: string;
  withSpinner?: boolean;
  isSubmitting?: boolean;
  btncls?: string;
} & ButtonPrimitive.Props;

export function CustomBtn({
  buttonLabel,
  leftIcon,
  onClick,
  bgColor,
  withSpinner,
  isSubmitting,
  btncls,
  className,
}: CustomBtnProps) {
  return (
    <button
      className={`h-9 w-fit flex rounded-[7px] py-2 px-4 gap-2.75 items-center btn-auth ${bgColor} ${btncls} ${className}`}
      onClick={onClick}
    >
      {leftIcon && <img src={leftIcon} className="h-4 w-4" />}
      <span className="flex flex-none mih-h-[17px] w-fit font-sans font-normal text-[14px] text-nowrap">
        {withSpinner === true && isSubmitting ? <Spinner /> : buttonLabel}
        {withSpinner === false && buttonLabel}
      </span>
    </button>
  );
}
