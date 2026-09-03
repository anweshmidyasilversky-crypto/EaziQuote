import { assets } from "@/assets/icons";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import CustomDialog from "@/components/common/CustomDialog";
import { CustomDataTable } from "@/components/common/CustomTable";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import StatusBadge from "@/components/common/StatusBadge";
import CardForm from "@/components/settings/CardForm";
import SettingsCard, {
  type SettingsCardProps,
} from "@/components/settings/SettingsCard";
import { invoiceData } from "@/constants/dummyData";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@/types/invoice.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useState } from "react";

function SuscriptionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [benifitModalOpen, toggleBenifitModalOpen] = useState(false);
  const [cardChangeOpen, toggleCardChangeOpen] = useState(false);
  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
  const invoiceColumns: ColumnDef<TableFeatures, Invoice>[] = [
    {
      accessorKey: "id",
      header: "INVOICE ID",
      enableSorting: false,
    },
    {
      accessorKey: "date",
      header: "DATE",
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: (info) => {
        return <StatusBadge status={info.getValue<InvoiceStatus>()} />;
      },
      enableSorting: false,
    },
    {
      accessorKey: "total",
      header: "AMOUNT",
      enableSorting: false,
    },
    {
      id: "action",
      header: () => <div className="flex w-full justify-end">ACTION</div>,
      meta: {
        headerClassName: cn(`justify-end!`),
      },
      cell: () => (
        <div className="min-w-125 flex justify-end pr-6.5">
          <CustomActionGroup downloadOnly />
        </div>
      ),
    },
  ];

  {
    /* For dummt purpose to show the states for subscribed, free and expired subscription user */
  }
  enum subStatus {
    free = "free",
    expired = "expired",
    pro = "pro",
  }
  const userSubStatus: subStatus = subStatus.pro;

  // Primary card according to different type of users
  const statusCardConfig: SettingsCardProps[] = [
    {
      icon: assets.subscriptionIconBlue,
      title: "Free Plan",
      info: `Free trial ends on November 20, 2025`,
      btnConfig: {
        buttonLabel: "Subscribe",
        btncls: cn(`bg-subscription-gradient`),
      },
      contentCls: "pb-4",
    },
  ];

  // IF paid user then add visa card detail
  if ((userSubStatus as subStatus) !== subStatus.free) {
    statusCardConfig.push({
      icon: assets.visaIconBlue,
      title: "Visa",
      btnConfig: {
        buttonLabel: "Change",
        btncls: cn(
          `bg-transparent border border-brand-dark text-brand-dark hover:bg-transparent`,
        ),
        onClick: () => toggleCardChangeOpen((curr) => !curr),
      },
      info: (
        <div className="flex flex-col gap-2 text-placeholder-text text-sm">
          <span> {"•••• •••• •••• 4069"} </span>
          <span> {`Expires on 21 August 2028`} </span>
        </div>
      ),
    });
  }

  // If pro user
  if ((userSubStatus as subStatus) === subStatus.pro) {
    Object.assign(statusCardConfig[0], {
      title: "Pro Plan",
      titleRightIcon: assets.infoIcon,
      rightIconAction: () => toggleBenifitModalOpen((curr) => !curr),
      btnConfig: {
        buttonLabel: "Cancel Plan",
        btncls: cn(
          `bg-transparent hover:bg-transparent border text-brand-dark border-brand-dark`,
        ),
      },
      info: (
        <div className="flex flex-col gap-2 text-sm text-placeholder-text">
          <span> {"£49/month"} </span>
          <span> {`Subscription ends on November 20, 2025`} </span>
        </div>
      ),
    } as SettingsCardProps);
  }

  // If subscription expired
  if ((userSubStatus as subStatus) === subStatus.expired) {
    Object.assign(statusCardConfig[0], {
      title: "No Active Plan",
      btnConfig: {
        ...statusCardConfig[0].btnConfig,
      },
      info: "Your subscription ended on November 20, 2025",
    } as SettingsCardProps);
  }

  const benifits = [
    { id: 1, benefit: "Web & Mobile Platforms" },
    { id: 2, benefit: "Unlimited quotes & invoices" },
    { id: 3, benefit: "Manage up to 100 clients & jobs" },
    { id: 4, benefit: "Custom branding" },
    { id: 5, benefit: "Reports & Insights" },
    { id: 6, benefit: "Priority customer support" },
  ];

  return (
    <>
      <HeaderBreadCrumb pageName="Subscription & Billing" />

      <div
        className={`m-6 grid ${statusCardConfig.length === 1 ? `grid-cols-1` : `grid-cols-2`} gap-6`}
      >
        {statusCardConfig.map((cardConfig) => (
          <SettingsCard
            {...cardConfig}
            key={cardConfig.title}
            cardCls={cn(`grow`)}
          />
        ))}
      </div>

      <div className="m-6 bg-white py-2 rounded-[7px]">
        <div className="overflow-x-auto">
          <CustomDataTable
            columns={invoiceColumns}
            data={invoiceData.map((invoice) => ({
              ...invoice,
              date: new Date().toLocaleDateString("en-Gb", {
                dateStyle: "medium",
              }),
            }))}
            title="Billing History"
            headerSlot={
              <div className="min-w-75">
                <SearchInputGruop
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  searchPlaceHolder="Search here"
                />
              </div>
            }
            globalFilterTerm={debouncedSearchTerm}
          />
        </div>
      </div>

      {/* Benifits listing */}
      <CustomDialog
        dialogOpen={benifitModalOpen}
        toggleDialogOpen={toggleBenifitModalOpen}
        header="Benefits"
      >
        <div className="p-5 flex flex-col gap-2 min-w-125">
          {benifits.map((benifit) => (
            <span key={benifit.id} className="flex gap-2 items-center">
              <img
                src={assets.tickMarkGreenIcon}
                className="h-2.25 aspect-auto"
              />
              <span className="text-sm"> {benifit.benefit} </span>
            </span>
          ))}
        </div>
      </CustomDialog>

      {/* Card chage form */}
      <CardForm isOpen={cardChangeOpen} toggleIsOpen={toggleCardChangeOpen} />
    </>
  );
}

export default SuscriptionPage;
