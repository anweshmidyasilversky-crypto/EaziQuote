import { assets } from "@/assets/icons";
import { ClientNameBadge } from "@/components/common/ClientNameBadge";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import {
  CustomHeader,
  type CustomHeaderProps,
} from "@/components/common/CustomHeader";
import { CustomDataTable } from "@/components/common/CustomTable";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import StatusBadge from "@/components/common/StatusBadge";
import { paymentRecords } from "@/constants/dummyData";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency, formatDisplayDate } from "@/lib/utils";
import type { paymentRecord, PaymentStatus } from "@/types/paymentRecord.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useState } from "react";

function PaymentsIndexPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce({ value: searchTerm });

  const headerBtnConfig: CustomHeaderProps["btnConfigList"] = [
    {
      buttonLabel: "Create Payment Record",
      leftIcon: assets.plusIcon,
    },
  ];

  const paymentsColumns: ColumnDef<TableFeatures, paymentRecord>[] = [
    {
      accessorKey: "id",
      enableSorting: false,
    },
    {
      accessorKey: "client_name",
      header: "client",
      cell: (info) => <ClientNameBadge name={info.getValue<string>()} />,
      enableSorting: false,
    },
    {
      accessorKey: "amount_type",
      header: "type",
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "amount",
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "allocated",
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "credit",
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "payment_date",
      header: "date",
      cell: (info) => formatDisplayDate(info.getValue<string>()),
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "status",
      cell: (info) => <StatusBadge status={info.getValue<PaymentStatus>()} />,
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "payment_method",
      header: "method",
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      id: "action",
      header: () => <div className="w-full flex justify-end">{"ACTION"}</div>,
      cell: () => (
        <div className="flex min-w-20 justify-end">
          <CustomActionGroup withEdit={false} withShare />
        </div>
      ),
    },
  ];

  return (
    <div className="p-5 flex flex-col gap-6">
      <CustomHeader
        header="Payments"
        headerInfo="Manage all your payments in one place"
        btnConfigList={headerBtnConfig}
      />

      <div className="bg-table py-5 flex flex-col gap-5 rounded-[10px]">
        <CustomDataTable
          columns={paymentsColumns}
          data={paymentRecords}
          showPaginated
          tableOptionsRight={
            <SearchInputGruop
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchPlaceHolder="Search payment id or clients"
            />
          }
          globalFilterTerm={debouncedSearch}
        />
      </div>
    </div>
  );
}

export default PaymentsIndexPage;
