import { showErrorToast } from "@/api/axiosInstance";
import { assets } from "@/assets/icons";
import {
  ActivitySummary,
  type ActivitySummaryProps,
} from "@/components/clients/ActivitySummary";
import { CustomBtn } from "@/components/common/CustomBtn";
import {
  CustomHeader,
  type CustomHeaderProps,
} from "@/components/common/CustomHeader";
import { CustomDataTable } from "@/components/common/CustomTable";
import { ShareOptions } from "@/components/common/ShareOptions";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import usePaymentDetails from "@/hooks/apis/payments/usePaymentDetails";
import usePaymentMutations from "@/hooks/apis/payments/usePaymentMutations";
import { cn, formatCurrency } from "@/lib/utils";
import {
  PaymentStatus,
  type PaymentAllocation,
} from "@/types/api.responses.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";

const formatDate = (dateString: string) => {
  const [year, month, date] = dateString.split("-").map(Number);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return formatter.format(new Date(year, month, date)).toLowerCase();
};

function PaymentsDetailsPage() {
  const params = useParams<{ id: string }>();
  const [shareModalOpen, toggleShareModalOpen] = useState(false);

  const { paymentDetails, isFetching } = usePaymentDetails({
    id: params.id ?? "",
  });

  const { paymentLinkShareMutation } = usePaymentMutations();

  const btnConfigList: CustomHeaderProps["btnConfigList"] = [
    <CustomBtn
      buttonLabel="Share"
      leftIcon={assets.shareIconWhite}
      onClick={() => toggleShareModalOpen(true)}
    />,
  ];

  const summaryConfig: ActivitySummaryProps["summaryConfig"] = [
    {
      summaryTitle: "Client",
      summaryIcon: assets.userIconWithGradient,
      summary: paymentDetails?.client_name,
    },
    {
      summaryTitle: "Amount",
      summaryIcon: assets.greenPoundIcon,
      summary: paymentDetails?.amount,
    },
    {
      summaryTitle: "Date",
      summaryIcon: assets.calenderIconBlue,
      summary: formatDate(
        paymentDetails?.date ??
          `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`,
      ),
    },
    {
      summaryTitle: "Type",
      summaryIcon: assets.paymentTypeIcon,
      summary: paymentDetails?.type,
    },
    {
      summaryTitle: "Method",
      summaryIcon: assets.walletIconOrage,
      summary: paymentDetails?.method,
    },
    {
      summaryTitle: "Credit Remaining",
      summaryIcon: assets.greenTickIcon,
      summary: paymentDetails?.credit_remaining,
    },
  ];

  const allocationTableColumns: ColumnDef<TableFeatures, PaymentAllocation>[] =
    [
      {
        accessorKey: "reference",
        header: "Invoice",
        enableSorting: false,
      },
      {
        accessorKey: "due_date",
        header: "Date",
        enableSorting: false,
        cell: (info) => {
          const dateString = info.getValue<string | null>();
          if (dateString !== null) {
            return formatDate(dateString);
          }
        },
      },
      {
        accessorKey: "amount",
        enableSorting: false,
        cell: (info) => {
          return formatCurrency(info.getValue<number>());
        },
      },
    ];

  const handleShare = () => {
    if (params.id) {
      paymentLinkShareMutation.mutate(params.id, {
        onSuccess: (response) => {
          toast.success(response.message);
          toggleShareModalOpen(false);
        },
        onError: (error) => {
          showErrorToast(error);
        },
      });
    } else {
      showErrorToast(`Unable to fetch payment`);
    }
  };

  return (
    <>
      {isFetching ? (
        <div className="flex h-full justify-center items-center">
          <Spinner className="text-brand-dark h-1/12 w-1/12" />
        </div>
      ) : (
        <div className="flex flex-col gap-6 p-6">
          <CustomHeader
            header={`Payment ID: ${paymentDetails?.id}`}
            btnConfigList={
              paymentDetails?.status === PaymentStatus.Received
                ? []
                : btnConfigList
            }
          />

          <ActivitySummary summaryConfig={summaryConfig} />

          <div className="bg-table rounded-[10px]">
            <CustomDataTable
              tableOptionsLeft={
                <div className="w-full">
                  <div className="w-full p-5 font-medium text-base text-black-text border-b border-b-separator">
                    {" "}
                    {"Allocation"}{" "}
                  </div>

                  <Separator className={`text-separator w-full pb-5`} />
                </div>
              }
              columns={allocationTableColumns}
              data={paymentDetails?.allocations ?? []}
              tableOptionsCls={cn(`px-0!`)}
            />
          </div>

          <ShareOptions
            isOpen={shareModalOpen}
            toggleIsOpen={toggleShareModalOpen}
            clientEmail={paymentDetails?.client_email ?? ""}
            sendEmailAction={handleShare}
            isEmailSending={paymentLinkShareMutation.isPending}
          />
        </div>
      )}
    </>
  );
}

export default PaymentsDetailsPage;
