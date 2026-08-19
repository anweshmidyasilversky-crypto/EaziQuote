export type KpiCardProps = {
  title: string;
  value: string;
  kpiIcon: string;
  iconBg: string;
};

export function KpiCard({ title, value, iconBg, kpiIcon }: KpiCardProps) {
  return (
    <div className="flex justify-between min-h-[113.5px] dashboard-card-theme rounded-[10px] p-4.5 ">
      {/* kpi det */}
      <div className="flex flex-col justify-between">
        {/* kpi title */}
        <span className="text-placeholder-text min-h-3.75 w-full">
          {" "}
          {title}{" "}
        </span>
        {/* kpi val */}
        <span className="font-semibold text-xl md:text-2xl"> {value} </span>
      </div>

      {/* kpi icon */}
      <div
        className={`flex justify-center items-center h-12 w-12 rounded-full ${iconBg}`}
      >
        <img src={kpiIcon} className="w-4.5 h-[18.52px]" />
      </div>
    </div>
  );
}
