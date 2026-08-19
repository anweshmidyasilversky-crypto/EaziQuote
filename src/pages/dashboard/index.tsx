import { assets } from "../../assets/icons";
import { CustomBtn } from "../../components/common/customBtn";
import { KpiCard, type KpiCardProps } from "../../components/common/kpiCard";
import { NotificationCard } from "../../components/dashboard/notification.card";
import { notifications } from "../../constants/dummyData";
import { formatOrdinalDate } from "../../lib/utils";

export function Index() {
  const kpiCardConfig: KpiCardProps[] = [
    {
      title: "Outstanding Invoices",
      value: "£12,500.00",
      kpiIcon: assets.invoiceColored,
      iconBg: "bg-transparent-royal-blue",
    },
    {
      title: "Pending Quotes",
      value: "£8,250.00",
      kpiIcon: assets.clockColored,
      iconBg: "bg-transparent-liquid-lava",
    },
    {
      title: "Money due this week",
      value: "£32,580",
      kpiIcon: assets.poundColored,
      iconBg: "bg-transparent-ming-green",
    },
    {
      title: "Quotes Accepted (Last 30 Days)",
      value: "20",
      kpiIcon: assets.invoiceColored,
      iconBg: "bg-transparent-royal-blue",
    },
  ];

  return (
    <div className="bg-dashboard h-full w-full">
      {/* Main container */}
      <div className="px-6 pt-6 flex pb-50.25 flex-col gap-6">
        {/* Heading */}
        <div className="flex w-full h-13.5 justify-between">
          {/* Date and greating */}
          <div className="flex flex-col gap-2">
            <span className="text-placeholder-text">
              {" "}
              {formatOrdinalDate(new Date())}{" "}
            </span>
            <span className="font-sans font-bold text-2xl">
              {" "}
              Welcome back, Matt! 👋{" "}
            </span>
          </div>

          {/* Button Group */}
          <div className="flex justify-between min-w-fit w-full max-w-99.5">
            <CustomBtn buttonLabel="New Quote" leftIcon={assets.plusIcon} />

            <CustomBtn buttonLabel="New Invoice" leftIcon={assets.plusIcon} />

            <CustomBtn buttonLabel="Add Client" leftIcon={assets.plusIcon} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6">
          {/* kpi cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {kpiCardConfig.map((kpiConfig) => {
              return (
                <KpiCard
                  key={kpiConfig.title}
                  title={kpiConfig.title}
                  value={kpiConfig.value}
                  kpiIcon={kpiConfig.kpiIcon}
                  iconBg={kpiConfig.iconBg}
                />
              );
            })}
          </div>
          <NotificationCard notifications={notifications} />
        </div>
      </div>
    </div>
  );
}
