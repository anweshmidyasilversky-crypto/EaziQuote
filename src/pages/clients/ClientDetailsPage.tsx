import { useParams } from "react-router";
import { assets } from "../../assets/icons";
import {
  ActivitySummary,
  type ActivitySummaryProps,
} from "../../components/clients/ActivitySummary";
import {
  ClientActivityStatus,
  mockClientActivity,
  mockClientData,
  type ClientActivity,
} from "../../constants/dummyData";
import { ChevronRight } from "lucide-react";
import type {
  ColumnDef,
  TableFeature,
  TableFeatures,
} from "@tanstack/react-table";
import StatusBadge from "../../components/common/StatusBadge";
import { CustomActionGroup } from "../../components/common/CustomActionGroup";
import { useState } from "react";
import { CustomDataTable } from "../../components/common/CustomTable";
import { CustomBtn } from "../../components/common/CustomBtn";
import { TableOptions } from "../../components/common/TableOptions";

export function ClientDetailsPage() {
  const param = useParams<{ id: string }>();
  const [currTable, toggleCurrTable] = useState<"activity" | "payment">(
    "activity",
  );
  const getClient = (clientId: string) => {
    return mockClientData.find((client) => client.id === clientId);
  };

  const clientCredential = getClient(param.id as string);
  let initial = "AC";
  if (clientCredential) {
    const [fname, lname] = clientCredential.client.split(" ");
    initial = fname[0].toUpperCase() + (lname ? lname[0].toUpperCase() : "");
  }

  const activityTableColums: ColumnDef<TableFeatures, ClientActivity>[] = [
    {
      accessorKey: "title",
      header: "TITLE",
    },
    {
      accessorKey: "quoteInvoice",
      header: "QUOTE/INVOICE",
    },
    {
      accessorKey: "amount",
      header: "AMOUNT",
      cell: (info) =>
        new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: "GBP",
        }).format(info.getValue<number>()),
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: (info) => {
        const status = info.getValue<ClientActivityStatus>();
        return <StatusBadge status={status} />;
      },
    },
    {
      accessorKey: "creationDate",
      header: "CREATION DATE",
    },
    {
      accessorKey: "expiryDueDate",
      header: "EXPIRY/DUE DATE",
    },
    {
      id: "actions",
      header: "ACTION",
      cell: ({ row }) => {
        const activity = row.original;

        return <CustomActionGroup />;
      },
    },
  ];

  const clientActivitySummary: ActivitySummaryProps["summaryConfig"] = [
    {
      summaryTitle: "Total quotes",
      summaryIcon: assets.invoiceColored,
      summary: 20,
    },
    {
      summaryTitle: "quotes accepted",
      summaryIcon: assets.greenTickIcon,
      summary: 16,
    },
    {
      summaryTitle: "total invoices",
      summaryIcon: assets.invoiceColored,
      summary: 12,
    },
    {
      summaryTitle: "outstanding balance",
      summaryIcon: assets.redPoundIcon,
      summary: "£2000",
    },
    {
      summaryTitle: "available credit",
      summaryIcon: assets.greenPoundIcon,
      summary: "£5000",
    },
  ];
  return (
    <div>
      {/* Heading and breadcrumb */}
      <div className="min-h-10.75 bg-white w-full flex justify-between dashboard-card-theme py-3 px-6">
        <span className="font-semibold uppercase text-[16px]">
          {" "}
          Client Detail{" "}
        </span>
        <div className="flex  items-center">
          <span className="text-[14px]"> Clients </span>
          <ChevronRight className="text-breadcrumb-separator h-4" />
          <span className="text-placeholder-text text-[14px]">
            {" "}
            Client Detail{" "}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-6">
        {/* Client info & summary */}
        <div className="flex flex-col lg:flex-row gap-6 min-h-27.75">
          {/* Client info */}
          <div className="flex justify-between items-center p-6 gap-6 bg-white rounded-[10px]">
            <div className="flex gap-4">
              <div className="flex justify-center items-center rounded-full bg-transparent-liquid-lava min-h-15 min-w-15">
                <span className="min-h-7.25 lg:text-6 font-medium uppercase text-center">
                  {" "}
                  {initial}{" "}
                </span>
              </div>
              <div className="flex flex-1 flex-col items-center">
                <span className="font-semibold text-lg md:text-xl">
                  {" "}
                  {clientCredential?.client ?? "Alexander Christopher"}{" "}
                </span>
                <span className="text-[14px] text-placeholder-text text-nowrap">
                  {" "}
                  {clientCredential?.company ?? "Greek Builders"}{" "}
                </span>
              </div>
            </div>

            <button className="flex items-center justify-center bg-[#F5F6FB] w-9 h-9 rounded-[10px] shrink-0">
              <img
                src={assets.moreIcon}
                alt="More options"
                className="h-4 w-3 object-contain"
              />
            </button>
          </div>
          {/* Activity summary */}
          <ActivitySummary summaryConfig={clientActivitySummary} />
        </div>

        <div className="w-full min-h-8.75 border-b border-b-client-detail-secondary">
          <div className="flex">
            <button
              className={`${currTable === "activity" ? "btn-auth" : ""} rounded-b-none w-34.5 min-h-4.75`}
              onClick={() => toggleCurrTable("activity")}
            >
              Recent Activity
            </button>

            <button
              className={`${currTable === "payment" ? "btn-auth" : ""} rounded-b-none w-34.5 min-h-4.75`}
              onClick={() => toggleCurrTable("payment")}
            >
              Payment
            </button>
          </div>
        </div>

        <div className="flex flex-col py-4.5 gap-4.5 bg-white rounded-[7px]">
          <div className="flex justify-between p-5">
            <span className="font-semibold uppercase"> Recent Activity </span>
            <CustomBtn leftIcon={assets.plusIcon} buttonLabel="New Quote" />
          </div>

          <TableOptions />
          <CustomDataTable
            columns={activityTableColums}
            data={mockClientActivity}
          />
        </div>
      </div>
    </div>
  );
}
