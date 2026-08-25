import { CustomBtn, type CustomBtnProps } from "./CustomBtn";

export type CustomHeaderProps = {
  header: string;
  headerInfo: string;
  btnConfigList: CustomBtnProps[];
};

export function CustomHeader({
  header,
  headerInfo,
  btnConfigList,
}: CustomHeaderProps) {
  return (
    <div className="flex justify-between items-center w-full min-h-13.5">
      <div className="flex flex-col gap-2 h-full">
        <span className="min-h-7.25 font-bold text-xl md:text-2xl self-start">
          {header}
        </span>
        <span className="min-h-4.25 text-placeholder-text text-[14px]">
          {headerInfo}
        </span>
      </div>

      <div className="flex justify-between gap-3">
        {btnConfigList.map((btnConfig) => (
          <CustomBtn {...btnConfig} key={btnConfig.buttonLabel} />
        ))}
      </div>
    </div>
  );
}
