import { assets } from "@/assets/icons";
import {
  ActivitySummary,
  type ActivitySummaryProps,
} from "@/components/clients/ActivitySummary";
import {
  CustomHeader,
  type CustomHeaderProps,
} from "@/components/common/CustomHeader";

function InvoiceIndexPage() {
  const btnConfig: CustomHeaderProps["btnConfigList"] = [
    {
      buttonLabel: "Invoice",
      leftIcon: assets.plusIcon,
    },
  ];

  const summaryConfig: ActivitySummaryProps["summaryConfig"] = [
    {
      summaryTitle: "total invoices",
      summaryIcon: assets.invoiceColored,
      summary: 6,
    },
    {
      summaryTitle: "paid",
      summaryIcon: assets.greenTickIcon,
      summary: 2,
    },
    {
      summaryTitle: "outstanding",
      summaryIcon: assets.orangeClockIcon,
      summary: 2,
    },
    {
      summaryTitle: "overdue",
      summaryIcon: assets.OrangeHourGlassIcon,
      summary: 2,
    },
  ];
  return (
    <div className="p-5 flex flex-col gap-6">
      <CustomHeader
        header="Invoices"
        headerInfo="Manage all your invoices in one place"
        btnConfigList={btnConfig}
      />

      <ActivitySummary summaryConfig={summaryConfig} />
    </div>
  );
}

export default InvoiceIndexPage;
