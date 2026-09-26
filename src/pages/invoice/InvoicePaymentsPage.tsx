import { assets } from "@/assets/icons";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomDataTable } from "@/components/common/CustomTable";
import { dateToDdMonYyyy, formatCurrency } from "@/lib/utils";
import type {
  InvoiceDetails,
  InvoicePayment,
} from "@/types/api.responses.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";

export type InvoicePaymentsPageProps = {
  invoice: InvoiceDetails | undefined;
};

function InvoicePaymentsPage({ invoice }: InvoicePaymentsPageProps) {
  const paymentsColumn: ColumnDef<TableFeatures, InvoicePayment>[] = [
    {
      accessorKey: "date",
      enableSorting: false,
      cell: (info) => {
        return dateToDdMonYyyy(info.getValue<string>());
      },
    },
    {
      accessorKey: "amount",
      enableSorting: false,
      cell: (info) => {
        return formatCurrency(info.getValue<number>());
      },
    },
    {
      accessorKey: "source",
      enableSorting: false,
    },
    {
      accessorKey: "allocated",
      enableSorting: false,
      cell: (info) => {
        return formatCurrency(info.getValue<number>());
      },
    },
    {
      id: "action",
      header: "Action",
      cell: (info) => {
        return <CustomActionGroup withOpen={false} withEdit={false} />;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5 pb-5 rounded-[10px] bg-table">
      <CustomDataTable
        columns={paymentsColumn}
        data={invoice?.payments ?? []}
        title="Payments"
        headerSlot={
          <CustomBtn
            buttonLabel="Create Payment Record"
            leftIcon={assets.plusIcon}
          />
        }
      />
      <span className="flex gap-1.5 items-center px-5">
        <img src={assets.warningIcon} className="h-3.5 aspect-square" />
        <p className="text-warning-text text-sm">
          {" "}
          {
            "Cash or offline payments should be completed directly and are not processed online."
          }{" "}
        </p>
      </span>
    </div>
  );
}

export default InvoicePaymentsPage;
