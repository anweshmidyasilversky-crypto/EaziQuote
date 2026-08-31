import { Spinner } from "../ui/spinner";
import React from "react";

export type CustomBtnProps = {
  buttonLabel: string;
  leftIcon?: string;
  rightIcon?: string;
  leftAction?: () => void;
  rightAction?: () => void;
  onClick?: () => void;
  leftCls?: string;
  rightCls?: string;
  bgColor?: string;
  withSpinner?: boolean;
  isSubmitting?: boolean;
  btncls?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function CustomBtn({
  buttonLabel,
  leftIcon,
  rightIcon,
  leftAction,
  leftCls,
  rightAction,
  rightCls,
  onClick,
  bgColor,
  withSpinner,
  isSubmitting,
  btncls,
  className,
  ...props
}: CustomBtnProps) {
  return (
    <button
      className={`h-9 w-fit flex rounded-[7px] py-2 px-4 gap-2.75 items-center btn-auth ${bgColor ?? ""} ${btncls ?? ""} ${className ?? ""}`}
      onClick={onClick}
      type="button"
      {...props}
    >
      {leftIcon && (
        <span
          className="w-5 h-5 flex items-center justify-center cursor-pointer select-none -ml-1 shrink-0"
          onClick={leftAction}
        >
          <img
            src={leftIcon}
            className={`w-4 h-4 object-contain ${leftCls ?? ""}`}
            alt=""
          />
        </span>
      )}
      <span className="flex flex-none min-h-4.25 w-fit font-sans font-normal text-[14px] text-nowrap">
        {withSpinner && isSubmitting ? <Spinner /> : buttonLabel}
      </span>
      {rightIcon && (
        <span
          className="w-5 h-5 flex items-center justify-center cursor-pointer select-none -mr-1 shrink-0"
          onClick={rightAction}
        >
          <img
            src={rightIcon}
            className={`w-4 h-4 object-contain ${rightCls ?? ""}`}
            alt=""
          />
        </span>
      )}
    </button>
  );
}
