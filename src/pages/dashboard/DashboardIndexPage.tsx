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
import { formatDisplayDate, formatOrdinalDate } from "../../lib/utils";

import { type ColumnDef, type TableFeatures } from "@tanstack/react-table";
import { ClientForm } from "../../components/clients/ClientForm";
import { useEffect, useState } from "react";
import type { DashboardActivityItem } from "@/types/api.responses.type";
import type { ClientCreationPayload } from "@/types/clientCreation.payload.type";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/store";
import { updateConfig } from "@/redux/slices/settings.slice";
import useAppConfig from "@/hooks/apis/appConfig/useAppConfig";
import useNotifications from "@/hooks/apis/notifications/useNotifications";
import useHome from "@/hooks/apis/home/useHome";
import { showErrorToast } from "@/api/axiosInstance";
import useClientMutations from "@/hooks/apis/clients/useClientMutations";

export function DashboardIndexPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [clientFormOpen, toggleClientFormOpen] = useState(false);

  const { data: homePage, isFetching: isRecentActivityFetching } = useHome();

  const { data: notificationList, isFetching: isNotificationFetching } =
    useNotifications();

  const appConfig = useAppConfig();

  useEffect(() => {
    if (appConfig) {
      dispatch(updateConfig(appConfig.payload));
    }
  }, [appConfig]);

  const { clientCreatMutation: clientMutation } = useClientMutations();

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
      cell: (info) => <ClientNameBadge name={info.getValue<string>()} />,
    },
    {
      accessorKey: "price",
      header: "AMOUNT",
      enableSorting: false,
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
      cell: (info) => (
        <CustomActionGroup
          openFn={() => navigate(`/quotes/${info.row.original.id}`)}
          editFn={() =>
            navigate(`/quotes/manage-quotes/${info.row.original.id}`)
          }
        />
      ),
    },
  ];

  const kpiCardConfig: KpiCardProps[] = [
    {
      title: "Outstanding Invoices",
      value:
        homePage?.payload.invoiceDetails.outstanding_invoices_amount?.toString() ??
        "",
      kpiIcon: assets.invoiceColored,
      iconCls: "bg-transparent-royal-blue",
    },
    {
      title: "Pending Quotes",
      value:
        homePage?.payload.quoteDetails.pending_quotes_amount?.toString() ?? "",
      kpiIcon: assets.clockColored,
      iconCls: "bg-transparent-liquid-lava",
    },
    {
      title: "Money due this week",
      value:
        homePage?.payload.financialSummary.money_due_this_week?.toString() ??
        "",
      kpiIcon: assets.greenPoundIcon,
      iconCls: "bg-transparent-ming-green",
    },
    {
      title: "Quotes Accepted (Last 30 Days)",
      value:
        homePage?.payload.recentActivities
          .reduce(
            (acc, activity) =>
              acc +
              Number(
                activity.type === "quote" && activity.status === "accepted",
              ),
            0,
          )
          .toString() ?? "",
      kpiIcon: assets.invoiceColored,
      iconCls: "bg-transparent-royal-blue",
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
              onClick={() => navigate(`/quotes/manage-quotes/`)}
            />

            <CustomBtn buttonLabel="New Invoice" leftIcon={assets.plusIcon} />

            <CustomBtn
              buttonLabel="Add Client"
              leftIcon={assets.plusIcon}
              onClick={() => toggleClientFormOpen((curr) => !curr)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 grow">
            {kpiCardConfig.map((kpiConfig) => {
              return (
                <KpiCard
                  key={kpiConfig.title}
                  title={kpiConfig.title}
                  value={kpiConfig.value}
                  kpiIcon={kpiConfig.kpiIcon}
                  iconCls={kpiConfig.iconCls}
                />
              );
            })}
          </div>
          {(isNotificationFetching || (notificationList.length ?? 0) > 0) && (
            <NotificationCard
              notifications={notificationList.slice(0, 5) ?? []}
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
    </div>
  );
}
