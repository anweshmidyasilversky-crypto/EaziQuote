import { useNavigate } from "react-router";
import { assets } from "../../assets/icons";
import { ClientNameBadge } from "../../components/common/ClientNameBadge";
import { CustomActionGroup } from "../../components/common/CustomActionGroup";
import { CustomBtn } from "../../components/common/CustomBtn";
import { CustomDataTable } from "../../components/common/CustomTable";
import { KpiCard, type KpiCardProps } from "../../components/common/kpiCard";
import StatusBadge from "../../components/common/StatusBadge";
import { NotificationCard } from "../../components/dashboard/notification.card";
import { type TransactionItem } from "../../constants/dummyData";
import {
  formatCurrency,
  formatDisplayDate,
  formatOrdinalDate,
} from "../../lib/utils";

import { type ColumnDef, type TableFeatures } from "@tanstack/react-table";
import { ClientForm } from "../../components/clients/ClientForm";
import { useEffect, useRef, useState } from "react";
import {
  ActivityType,
  type DashboardActivityItem,
} from "@/types/api.responses.type";
import type { ClientCreationPayload } from "@/types/clientCreation.payload.type";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { updateConfig } from "@/redux/slices/settings.slice";
import useAppConfig from "@/hooks/apis/appConfig/useAppConfig";
import useNotifications from "@/hooks/apis/notifications/useNotifications";
import useHome from "@/hooks/apis/home/useHome";
import { showErrorToast } from "@/api/axiosInstance";
import useClientMutations from "@/hooks/apis/clients/useClientMutations";
import DeleteDialog from "@/components/common/DeleteDialog";
import useQuotesMutations from "@/hooks/apis/quotes/useQuotesMutations";
import useInvoiceMutations from "@/hooks/apis/invoices/useInvoiceMutations";
import WarningDialog from "@/components/common/WarningDialog";
import {
  SettingsPaymentPageReason,
  type SettingsLocationProps,
} from "@/types/common.types";

export function DashboardIndexPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [clientFormOpen, toggleClientFormOpen] = useState(false);
  const [deleteModalOpen, toggleDeleteModal] = useState(false);
  const [addBankDetailsDialog, setAddBankDetailsDialog] = useState(false);
  const [addSignatureWarningOpen, setAddSignatureWarningOpen] = useState(false);
  const [subsEndWarningOpen, setSubsEndWarningOpen] = useState(false);
  const targetActivityType = useRef<ActivityType>(ActivityType.QUOTE);
  const targetId = useRef<number | undefined>(undefined);

  const {
    data: homePage,
    isFetching: isRecentActivityFetching,
    refetch: refetchHome,
  } = useHome();

  const { data: notificationList, isFetching: isNotificationFetching } =
    useNotifications();

  const appConfig = useAppConfig();

  useEffect(() => {
    if (appConfig) {
      dispatch(updateConfig(appConfig.payload));
    }
  }, [appConfig]);

  const { clientCreatMutation: clientMutation } = useClientMutations();
  const { quoteDeleteMutation } = useQuotesMutations();
  const { invoiceDeleteMutation } = useInvoiceMutations();

  const columns: ColumnDef<TableFeatures, DashboardActivityItem>[] = [
    {
      accessorKey: "title",
      header: "TITLE",
      enableSorting: false,
    },
    {
      accessorKey: "reference_number",
      header: "QUOTE/INVOICE",
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "CLIENT",
      enableSorting: false,
      cell: (info) => (
        <ClientNameBadge name={info.getValue<string>()} textWrap />
      ),
    },
    {
      accessorKey: "price",
      header: "AMOUNT",
      enableSorting: false,
      cell: (info) => formatCurrency(info.getValue<number>()),
    },
    {
      accessorKey: "status",
      header: "STATUS",
      enableSorting: false,
      cell: (info) => {
        const status = info.getValue<TransactionItem["status"]>();
        return <StatusBadge status={status} />;
      },
    },
    {
      accessorKey: "created_at",
      header: "CREATION DATE",
      enableSorting: false,
      cell: (info) => {
        const date = info.getValue<string | undefined>();
        if (date) {
          return formatDisplayDate(date);
        }
      },
    },
    {
      accessorKey: "expiry_date",
      header: "EXPIRY/DUE DATE",
      enableSorting: false,
      cell: (info) => {
        const date = info.getValue<string | undefined>();
        if (date) {
          return formatDisplayDate(date);
        }
      },
    },
    {
      id: "actions",
      header: "ACTION",
      enableSorting: false,
      cell: (info) => {
        const { id, type } = info.row.original;
        return (
          <CustomActionGroup
            openFn={() => {
              if (type === ActivityType.QUOTE) {
                navigate(`/quotes/${id}`);
              } else {
                navigate(`/invoices/${id}`);
              }
            }}
            editFn={() => {
              if (type === ActivityType.QUOTE) {
                navigate(`/quotes/manage-quotes/${id}`);
              } else {
                navigate(`/invoices/manage-invoice/${id}`);
              }
            }}
            deleteFn={() => {
              ((targetActivityType.current = info.row.original.type),
                (targetId.current = info.row.original.id));
              toggleDeleteModal((curr) => !curr);
            }}
          />
        );
      },
    },
  ];

  const handleActivityDelete = () => {
    if (targetId.current) {
      if (targetActivityType.current === ActivityType.QUOTE) {
        quoteDeleteMutation.mutate(targetId.current, {
          onSuccess: (response) => {
            toast.success(response.message);
            toggleDeleteModal(false);
            refetchHome();
          },
          onError: (error) => {
            showErrorToast(error);
          },
        });
      } else {
        invoiceDeleteMutation.mutate(targetId.current, {
          onSuccess: (response) => {
            toast.success(response.message);
            toggleDeleteModal(false);
            refetchHome();
          },
          onError: (error) => {
            showErrorToast(error);
          },
        });
      }
    } else {
      toast.error(`No activity selected for delete`);
    }
  };

  const kpiCardConfig: KpiCardProps[] = [
    {
      title: "Outstanding Invoices",
      value: formatCurrency(
        homePage?.payload.invoiceDetails.outstanding_invoices_amount ?? 0,
      ),
      kpiIcon: assets.invoiceColored,
      iconCls: "bg-transparent-royal-blue",
      onClick: () => navigate(`/invoices`),
    },
    {
      title: "Pending Quotes",
      value: formatCurrency(
        homePage?.payload.quoteDetails.pending_quotes_amount ?? 0,
      ),
      kpiIcon: assets.clockColored,
      iconCls: "bg-transparent-liquid-lava",
      onClick: () => navigate(`/quotes`),
    },
    {
      title: "Money due this week",
      value: formatCurrency(
        homePage?.payload.financialSummary.money_due_this_week ?? 0,
      ),
      kpiIcon: assets.greenPoundIcon,
      iconCls: "bg-transparent-ming-green",
      onClick: () => navigate(`/invoices`),
    },
    {
      title: "Quotes Accepted ",
      titleExtra: "(Last 30 Days)",
      value: formatCurrency(
        homePage?.payload.recentActivities.reduce(
          (acc, activity) =>
            acc +
            Number(activity.type === "quote" && activity.status === "accepted"),
          0,
        ) ?? 0,
      ),
      kpiIcon: assets.invoiceColored,
      iconCls: "bg-transparent-royal-blue",
      onClick: () => navigate(`/quotes`),
    },
  ];

  const addClientFn = async (client: ClientCreationPayload) => {
    clientMutation.mutate(
      {
        ...client,
        company_name: client.companyName,
        address: client.street,
        postcode: client.postCode,
      },
      {
        onSuccess: (newClient) => {
          toast.success(newClient.message);
          toggleClientFormOpen(false);
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  const canUsercreateRecord = () => {
    if (!user.hasBankAccountDetailAdded) {
      setAddBankDetailsDialog(true);
      return false;
    }
    if (!user.hasSignatureAdded) {
      setAddSignatureWarningOpen(true);
      return false;
    }
    if (!(user.is_trial_period || user.is_subscription_active)) {
      setSubsEndWarningOpen(true);
      return false;
    }
    return true;
  };

  return (
    <div className="h-full w-full">
      {/* Main container */}
      <div className="px-6 pt-6 flex pb-5 flex-col gap-6">
        {/* Heading */}
        <div className="flex w-full min-h-13.5 justify-between">
          {/* Date and greeting */}
          <div className="flex flex-col gap-2">
            <span className="text-placeholder-text">
              {" "}
              {formatOrdinalDate(new Date())}{" "}
            </span>
            <span className="font-sans font-bold text-2xl text-nowrap">
              {" "}
              Welcome back, Matt! 👋{" "}
            </span>
          </div>

          {/* Button Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 [&_button]:w-full">
            <CustomBtn
              buttonLabel="New Quote"
              leftIcon={assets.plusIcon}
              onClick={() => {
                if (canUsercreateRecord()) {
                  navigate(`/quotes/manage-quotes/`);
                }
              }}
            />

            <CustomBtn
              buttonLabel="New Invoice"
              leftIcon={assets.plusIcon}
              onClick={() => {
                if (canUsercreateRecord()) {
                  navigate(`/invoices/manage-invoice`);
                }
              }}
            />

            <CustomBtn
              buttonLabel="Add Client"
              leftIcon={assets.plusIcon}
              onClick={() => toggleClientFormOpen((curr) => !curr)}
            />
          </div>
        </div>

        <div
          className={`w-full grid ${notificationList.length <= 0 && !isNotificationFetching ? `grid-cols-1` : `grid-cols-2`} gap-2`}
        >
          {/* KPI cards */}
          <div className="w-full grid grid-cols-2 gap-4">
            {kpiCardConfig.map((kpiConfig) => {
              return (
                <KpiCard
                  key={kpiConfig.title}
                  title={kpiConfig.title}
                  titleExtra={kpiConfig.titleExtra}
                  value={kpiConfig.value}
                  kpiIcon={kpiConfig.kpiIcon}
                  iconCls={kpiConfig.iconCls}
                  onClick={kpiConfig.onClick}
                />
              );
            })}
          </div>

          {(isNotificationFetching || notificationList.length > 0) && (
            <NotificationCard
              notifications={notificationList.slice(0, 5)}
              isFetching={isNotificationFetching}
            />
          )}
        </div>

        <div className="flex flex-col py-4.5 gap-4.5 bg-table dashboard-card-theme rounded-[10px]">
          <span className="w-full flex min-h-4.75 font-medium text-[16px] px-5 items-center">
            {" "}
            Recent Activity{" "}
          </span>
          <CustomDataTable
            columns={columns}
            data={homePage?.payload.recentActivities ?? []}
            isFetching={isRecentActivityFetching}
          />
        </div>
      </div>

      <ClientForm
        isFormOpen={clientFormOpen}
        toggleFormOpen={toggleClientFormOpen}
        mode="creation"
        clientCreatFn={addClientFn}
        isSubmitting={clientMutation.isPending}
      />

      <DeleteDialog
        isOpen={deleteModalOpen}
        toggleOpen={toggleDeleteModal}
        deleteAction={handleActivityDelete}
        isPending={
          quoteDeleteMutation.isPending || invoiceDeleteMutation.isPending
        }
      />

      <WarningDialog
        open={addBankDetailsDialog}
        toggleOpen={setAddBankDetailsDialog}
        warningHeader="Complete Your Setup"
        warningContent="Add your bank details and signature to ensure your quotes look professional and include payment information."
        acceptBtnLabel="Complete Setup"
        acceptAction={() => navigate(`/settings/payments-and-invoicing`)}
        withCancelBtn={false}
      />

      <WarningDialog
        open={addSignatureWarningOpen}
        toggleOpen={setAddSignatureWarningOpen}
        warningHeader="Add Your Signature"
        warningContent="Adding a signature helps build trust and makes your quote feel complete and professional."
        withCancelBtn={false}
        acceptBtnLabel="Add Signature"
        acceptAction={() =>
          navigate(`/settings/payments-and-invoicing`, {
            state: {
              reason: SettingsPaymentPageReason.addSignature,
            } as SettingsLocationProps,
          })
        }
      />

      <WarningDialog
        open={subsEndWarningOpen}
        toggleOpen={setSubsEndWarningOpen}
        warningHeader="Subscription Required"
        warningContent="To continue using EaziQuote, please activate or renew your subscription."
        acceptBtnLabel="Activate Subscription"
        acceptAction={() => navigate(`/subscribe-plan`)}
        withCancelBtn={false}
        warningImgElement={
          <div className="relative flex items-center justify-center">
            <img src={assets.polygonGradient} className="h-20 aspect-auto" />
            <img
              src={assets.subsCriptionWhiteIcon}
              className="h-7.5 aspect-auto z-10 absolute"
            />
          </div>
        }
      />
    </div>
  );
}
