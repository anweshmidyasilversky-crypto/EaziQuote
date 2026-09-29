import { assets } from "@/assets/icons";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomDataTable } from "@/components/common/CustomTable";
import { dateToDdMonYyyy, formatCurrency } from "@/lib/utils";
import {
  InvoiceStatus,
  PaymentTypes,
  type InvoiceDetails,
  type InvoicePayment,
} from "@/types/api.responses.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useNavigate } from "react-router";
import type { PaymentCreatePageLocationProps } from "../payments/PaymentCreatePage";
import { useEffect } from "react";
import useInvoiceList from "@/hooks/apis/invoices/useInvoiceList";

export type InvoicePaymentsPageProps = {
  invoice: InvoiceDetails | undefined;
};

function InvoicePaymentsPage({ invoice }: InvoicePaymentsPageProps) {
  const navigate = useNavigate();

  const { invoiceList, isFetching } = useInvoiceList({
    enabled: invoice !== undefined,
    initialSearchTerm: invoice?.invoice_number,
  });

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
      cell: () => {
        return <CustomActionGroup withOpen={false} withEdit={false} />;
      },
    },
  ];

  useEffect(() => {
    if (
      invoiceList &&
      invoiceList.at(0)?.reference_number === invoice?.invoice_number
    ) {
      console.log(invoiceList);
    }
  }, [invoiceList]);

  return (
    <div className="flex flex-col gap-5 pb-5 rounded-[10px] bg-table">
      <CustomDataTable
        columns={paymentsColumn}
        data={invoice?.payments ?? []}
        title="Payments"
        headerSlot={
          <>
            {invoice?.status && invoice.status !== InvoiceStatus.paid && (
              <CustomBtn
                buttonLabel="Create Payment Record"
                leftIcon={assets.plusIcon}
                onClick={() => {
                  navigate(`/payments/record-payment`, {
                    state: {
                      invoice: invoiceList.at(0),
                      paymentType: PaymentTypes.invoice,
                    } as PaymentCreatePageLocationProps,
                  });
                }}
                isSubmitting={isFetching}
              />
            )}
          </>
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
