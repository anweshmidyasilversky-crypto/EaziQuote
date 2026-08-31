import { useNavigate } from "react-router";
import { assets } from "../../assets/icons";
import { ClientNameBadge } from "../../components/common/ClientNameBadge";
import { CustomActionGroup } from "../../components/common/CustomActionGroup";
import { CustomBtn } from "../../components/common/CustomBtn";
import { CustomDataTable } from "../../components/common/CustomTable";
import { KpiCard, type KpiCardProps } from "../../components/common/KpiCard";
import StatusBadge from "../../components/common/StatusBadge";
import { NotificationCard } from "../../components/dashboard/Notification.card";
import {
  notifications,
  type TransactionItem,
} from "../../constants/dummyData";
import {
  formatCurrency,
  formatDisplayDate,
  formatOrdinalDate,
  getQuoteAmount,
} from "../../lib/utils";

import { type ColumnDef, type TableFeatures } from "@tanstack/react-table";
import { ClientForm } from "../../components/clients/ClientForm";
import { useMemo, useState } from "react";
import { useAppSelector } from "../../redux/store";

export function DashboardIndexPage() {
  const navigate = useNavigate();
  const [clientFormOpen, toggleClientFormOpen] = useState(false);

  // ── Redux state ─────────────────────────────────────────────────────────────
  const reduxQuotes = useAppSelector((state) => state.quotes);
  const reduxClients = useAppSelector((state) => state.clients);

  // Derive transactionItems from Redux quotes (most recent first)
  const transactionItems: TransactionItem[] = useMemo(() => {
    return [...reduxQuotes]
      .sort(
        (a, b) =>
          new Date(b.quoteDate).getTime() - new Date(a.quoteDate).getTime(),
      )
      .map((q) => {
        const client = reduxClients.find((c) => c.id === q.clientId);
        const amount = getQuoteAmount(q); // sum of item totals
        return {
          id: q.id,
          title: q.title,
          quoteInvoice: q.referenceNumber,
          client: client?.name ?? "Unknown Client",
          amount: formatCurrency(amount),
          status: q.status as TransactionItem["status"],
          creationDate: formatDisplayDate(q.quoteDate),
          expiryDueDate: formatDisplayDate(q.expiryDate),
        };
      });
  }, [reduxQuotes, reduxClients]);

  // ── KPI metrics derived from Redux ──────────────────────────────────────────
  const kpiValues = useMemo(() => {
    const sentQuotes = reduxQuotes.filter((q) => q.status === "Sent");
    const draftQuotes = reduxQuotes.filter((q) => q.status === "Draft");
    const acceptedLast30 = reduxQuotes.filter((q) => q.status === "Accepted");

    const outstandingTotal = sentQuotes.reduce(
      (sum, q) => sum + getQuoteAmount(q),
      0,
    );
    const pendingTotal = draftQuotes.reduce(
      (sum, q) => sum + getQuoteAmount(q),
      0,
    );

    return {
      outstanding: formatCurrency(outstandingTotal),
      pending: formatCurrency(pendingTotal),
      acceptedCount: String(acceptedLast30.length),
    };
  }, [reduxQuotes]);

  const columns: ColumnDef<TableFeatures, TransactionItem>[] = [
    {
      accessorKey: "title",
      header: "TITLE",
      enableSorting: false,
    },
    {
      accessorKey: "quoteInvoice",
      header: "QUOTE/INVOICE",
      enableSorting: false,
    },
    {
      accessorKey: "client",
      header: "CLIENT",
      enableSorting: false,
      cell: (info) => <ClientNameBadge name={info.getValue<string>()} />,
    },
    {
      accessorKey: "amount",
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
      accessorKey: "creationDate",
      header: "CREATION DATE",
      enableSorting: false,
    },
    {
      accessorKey: "expiryDueDate",
      header: "EXPIRY/DUE DATE",
      enableSorting: false,
    },
    {
      id: "actions",
      header: "ACTION",
      enableSorting: false,
      cell: (info) => (
        <CustomActionGroup
          openFn={() => navigate(`/quotes/${info.row.original.id}`)}
        />
      ),
    },
  ];

  const kpiCardConfig: KpiCardProps[] = [
    {
      title: "Outstanding Invoices",
      value: kpiValues.outstanding,
      kpiIcon: assets.invoiceColored,
      iconCls: "bg-transparent-royal-blue",
    },
    {
      title: "Pending Quotes",
      value: kpiValues.pending,
      kpiIcon: assets.clockColored,
      iconCls: "bg-transparent-liquid-lava",
    },
    {
      title: "Money due this week",
      value: "£32,580",
      kpiIcon: assets.poundColored,
      iconCls: "bg-transparent-ming-green",
    },
    {
      title: "Quotes Accepted (Last 30 Days)",
      value: kpiValues.acceptedCount,
      kpiIcon: assets.invoiceColored,
      iconCls: "bg-transparent-royal-blue",
    },
  ];

  return (
    <div className="h-full w-full">
      {/* Main container */}
      <div className="px-6 pt-6 flex pb-5 flex-col gap-6">
        {/* Heading */}
        <div className="flex w-full h-13.5 justify-between">
          {/* Date and greeting */}
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

            <CustomBtn
              buttonLabel="Add Client"
              leftIcon={assets.plusIcon}
              onClick={() => toggleClientFormOpen((curr) => !curr)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6">
          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          <NotificationCard notifications={notifications} />
        </div>

        <div className="flex flex-col py-4.5 gap-4.5 bg-table dashboard-card-theme rounded-[10px]">
          <span className="w-full flex min-h-4.75 font-medium text-[16px] px-5 items-center">
            {" "}
            Recent Activity{" "}
          </span>
          <CustomDataTable columns={columns} data={transactionItems} />
        </div>
      </div>

      <ClientForm
        isFormOpen={clientFormOpen}
        toggleFormOpen={toggleClientFormOpen}
        mode="creation"
      />
    </div>
  );
}
