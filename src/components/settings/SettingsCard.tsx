import React from "react";
import { CustomBtn, type CustomBtnProps } from "../common/CustomBtn";
import { Card, CardContent } from "../ui/card";

export type SettingsCardProps = {
  icon: string;
  title: string;
  titleRightIcon?: string;
  rightIconAction?: () => void;
  titleDesc?: string;
  info?: string | React.ReactNode;
  btnConfig?: CustomBtnProps;
  contentCls?: string;
  btnCls?: string;
  titleCls?: string;
  cardCls?: string;
  onClick?: () => void;
};

function SettingsCard({
  icon,
  title,
  titleDesc,
  titleRightIcon,
  info,
  btnConfig,
  titleCls,
  contentCls,
  cardCls,
  onClick,
  rightIconAction,
}: SettingsCardProps) {
  return (
    <Card
      className={`dashboard-card-theme rounded-[10px] p-0 m-0 cursor-pointer ring-0 ${cardCls}  transition-transform duration-200 ease-in-out hover:translate-y-0.5 `}
      onClick={onClick}
    >
      <CardContent
        className={`w-full p-4 pb-0 flex flex-col gap-4 ${contentCls}`}
      >
        <div className="flex align-top gap-4 align-center">
          {/* Icon */}
          <div
            className="h-12 aspect-square bg-settings-card-secondary flex 
            justify-center items-center rounded-[7px]"
          >
            <img src={icon} className="max-h-7 max-w-7 aspect-auto" />
          </div>

          {/* Title and description */}
          <div className="flex justify-between w-full items-center align-middle">
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2 items-center">
                <span className={`font-medium text-base ${titleCls}`}>
                  {" "}
                  {title}{" "}
                </span>
                {titleRightIcon && (
                  <button onClick={rightIconAction}>
                    <img src={titleRightIcon} className="w-3.5 aspect-auto" />
                  </button>
                )}
              </div>
              <span className="text-sm text-placeholder-text">
                {" "}
                {titleDesc}{" "}
              </span>
            </div>

            {/* right btn */}
            {btnConfig && (
              <CustomBtn
                {...btnConfig}
                className="bg-settings-card-btn mt-1.5"
              />
            )}
          </div>
        </div>

        <div className="pb-4">
          {/* info */}
          {React.isValidElement(info) ? (
            info
          ) : (
            <span className="text-sm text-placeholder-text"> {info} </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default SettingsCard;
