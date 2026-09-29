export type KpiCardProps = {
  title: string;
  value: string;
  kpiIcon: string;
  iconCls?: string;
  onClick?: () => void;
};

export function KpiCard({
  title,
  value,
  iconCls,
  kpiIcon,
  onClick,
}: KpiCardProps) {
  return (
    <div
      className={`flex justify-between min-h-[113.5px] dashboard-card-theme rounded-[10px] p-4.5 ${onClick ? `cursor-pointer hover:translate-y-0.5 transition-transform delay-100 ease-in-out` : ``}`}
      onClick={onClick}
    >
      {/* KPI details */}
      <div className="flex flex-col justify-between">
        {/* KPI title */}
        <span className="text-placeholder-text min-h-3.75 w-full text-wrap wrap-break-word">
          {title}
        </span>
        {/* KPI value */}
        <span className="font-semibold text-xl md:text-2xl">{value}</span>
      </div>

      {/* KPI icon container */}
      <div className="flex justify-end items-center">
        <div
          className={`flex justify-center items-center h-12 w-12 rounded-full ${iconCls}`}
        >
          <img
            src={kpiIcon}
            className="w-[18px] h-auto"
            alt={`${title} icon`}
          />
        </div>
      </div>
    </div>
  );
}
