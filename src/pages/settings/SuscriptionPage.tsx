import { showErrorToast } from "@/api/axiosInstance";
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
import { Spinner } from "@/components/ui/spinner";
import useBillingInvoiceList from "@/hooks/apis/subscription/useBillingInvoiceList";
import useSubscriptionMutations from "@/hooks/apis/subscription/useSubscriptionMutations";
import { useDebounce } from "@/hooks/useDebounce";
import { cn, dateToDdMonYyyy, formatDisplayDate } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import {
  InvoiceStatus,
  type BillingInvoiceItem,
} from "@/types/api.responses.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function SuscriptionPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [benifitModalOpen, toggleBenifitModalOpen] = useState(false);
  const [cardChangeOpen, toggleCardChangeOpen] = useState(false);
  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
  const targetBillInvoice = useRef<BillingInvoiceItem | undefined>(undefined);

  const { downloadInvoiceMutation } = useSubscriptionMutations();

  const handleDownload = () => {
    if (!targetBillInvoice.current) {
      toast.error(`No invoice selected for download`);
      return;
    }
    downloadInvoiceMutation.mutate(targetBillInvoice.current.invoice_url, {
      onSuccess: (response) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice-${targetBillInvoice.current?.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const invoiceColumns: ColumnDef<TableFeatures, BillingInvoiceItem>[] = [
    {
      accessorKey: "id",
      header: "INVOICE ID",
      enableSorting: false,
    },
    {
      accessorKey: "paid_at",
      header: "DATE",
      enableSorting: false,
      cell: (info) =>
        dateToDdMonYyyy(new Date(info.getValue<string>()).toISOString()),
    },
    {
      id: "status",
      header: "STATUS",
      cell: () => {
        return <StatusBadge status={InvoiceStatus.paid} />;
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
      header: () => (
        <div className="w-full grid grid-cols-3">
          <span className="col-start-3"> {"Action"} </span>
        </div>
      ),
      cell: (info) => {
        const { id } = info.row.original;
        const currMutatingInvoiceId = targetBillInvoice.current?.id;
        return (
          <div className="w-full grid grid-cols-3">
            <div className="col-start-3">
              {currMutatingInvoiceId === id &&
              downloadInvoiceMutation.isPending ? (
                <Spinner className="text-brand-dark" />
              ) : (
                <CustomActionGroup
                  downloadOnly
                  downloadFn={() => {
                    targetBillInvoice.current = info.row.original;
                    handleDownload();
                  }}
                />
              )}
            </div>
          </div>
        );
      },
    },
  ];

  const [pageNo, setPageNo] = useState(1);
  const [prevPageLastIds, setPrevPageLastIds] = useState<string[]>([]);
  const isFetchingNextPage = useRef<boolean>(false);
  const [startAfter, setStartAfter] = useState<string | undefined>(undefined);

  const { invoiceList, isFetching, hasNextPage } = useBillingInvoiceList({
    start_after: startAfter,
  });
  useEffect(() => {
    if (isFetchingNextPage.current) {
      isFetchingNextPage.current = false;
      if (invoiceList.length >= 1) {
        setPrevPageLastIds((curr) => [
          ...curr,
          invoiceList.at(-1)?.id as string,
        ]);
      }
    }
  }, [invoiceList]);

  const user = useAppSelector((state) => state.user);
  enum subStatus {
    free = "free",
    expired = "expired",
    pro = "pro",
  }
  let userSubStatus: subStatus = subStatus.expired;
  if (user.is_trial_period) {
    userSubStatus = subStatus.free;
  } else {
    if (user.is_subscription_active) {
      userSubStatus = subStatus.pro;
    } else {
      userSubStatus = subStatus.expired;
    }
  }

  // Primary card according to different type of users
  const statusCardConfig: SettingsCardProps[] = [
    {
      icon: assets.subscriptionIconBlue,
      title: "Free Plan",
      info: `Free trial ends on ${formatDisplayDate(user.subscription_ended_at ?? new Date().toISOString())}`,
      btnConfig: {
        buttonLabel: "Subscribe",
        btncls: cn(`bg-subscription-gradient`),
        onClick: () => navigate(`/subscribe-plan`),
      },
      contentCls: "pb-4",
    },
  ];

  // IF paid user then add visa card detail
  if ((userSubStatus as subStatus) === subStatus.pro) {
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
          <span>
            {" "}
            {`Expires on ${formatDisplayDate(user.subscription_ended_at ?? "")}`}{" "}
          </span>
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
    console.log(user.subscription_ended_at);
    Object.assign(statusCardConfig[0], {
      title: "No Active Plan",
      btnConfig: {
        ...statusCardConfig[0].btnConfig,
      },
      info: `${user.subscription_ended_at ? ` Your subscription ended on ${formatDisplayDate(user.subscription_ended_at)} ` : ` Your subscription is expired `}`,
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
            data={invoiceList}
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
            isFetching={isFetching}
          />
        </div>

        <div className="w-full flex gap-2 justify-end [&_button]:btn-auth [&_button]:table-pagination-btn-common [&_button]:min-w-fit! [&_button]:disabled:translate-y-0! px-5">
          <button
            disabled={pageNo === 1}
            className={cn(
              `table-pagination-btn-inactive disabled:text-muted disabled:hover:text-muted`,
            )}
            onClick={() => {
              const cursur = prevPageLastIds.at(-2);
              setPrevPageLastIds((curr) => curr.slice(0, -2));
              setStartAfter(cursur);
              setPageNo((curr) => curr - 1);
            }}
          >
            {"Previous"}
          </button>

          <button className="bg-brand-dark! text-white!">{pageNo}</button>

          <button
            disabled={!hasNextPage}
            className={cn(
              `table-pagination-btn-inactive disabled:text-muted disabled:hover:text-muted`,
            )}
            onClick={() => {
              isFetchingNextPage.current = true;
              setStartAfter(prevPageLastIds.at(-1));
              setPageNo((curr) => curr + 1);
            }}
          >
            {"Next"}
          </button>
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
