import React from "react";
import { CustomBtn, type CustomBtnProps } from "./CustomBtn";
import { cn } from "@/lib/utils/helper";

export type CustomHeaderProps = {
  header: string;
  headerInfo?: string;
  btnConfigList: (CustomBtnProps | React.ReactNode)[];
  containerCls?: string;
  btnListCls?: string;
};

export function CustomHeader({
  header,
  headerInfo,
  btnConfigList,
  containerCls,
  btnListCls,
}: CustomHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:justify-between md:items-center w-full min-h-13.5",
        containerCls,
      )}
    >
      <div className="flex flex-col gap-2 h-full">
        <span className="min-h-7.25 max-w-[35vw] truncate font-bold text-xl md:text-2xl self-start">
          {header}
        </span>
        {headerInfo && (
          <span className="min-h-4.25 text-placeholder-text text-[14px]">
            {headerInfo}
          </span>
        )}
      </div>

      <div
        className={cn(
          `flex justify-between gap-3 max-md:grid max-md:grid-cols-${btnConfigList.length > 1 ? 2 : 1} max-md:[&_button]:w-full max-md:[&>span]:w-full`,
          btnListCls,
        )}
      >
        {btnConfigList.map((btnConfig, index) => {
          if (React.isValidElement(btnConfig)) {
            return <React.Fragment key={index}>{btnConfig}</React.Fragment>;
          }
          const props = btnConfig as CustomBtnProps;
          return (
            <CustomBtn
              {...props}
              key={props.buttonLabel || index}
              id={props.buttonLabel}
            />
          );
        })}
      </div>
    </div>
  );
}
