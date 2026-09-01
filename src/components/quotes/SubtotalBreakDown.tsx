import type {
  ColumnDef,
  HeaderContext,
  TableFeatures,
} from "@tanstack/react-table";
import { assets } from "../../assets/icons";
import type { QuoteLineItem } from "../../types/quoteLineItem.type";
import type { QuotePaymentMethod } from "../../types/quote.type";
import { formatCurrency } from "../../lib/utils";
import { useMemo, useState } from "react";
import CustomDialog from "../common/CustomDialog";
import { CustomDataTable } from "../common/CustomTable";
import AddDeposite from "./AddDeposite";

export type SubtotalBreakDownProps = {
  paymentMethod: QuotePaymentMethod;
  /** Pre-computed quote amount: sum of all item totals */
  subtotal: number;
  items: QuoteLineItem[];
  taxPercentage: number;
  marginPercentage: number;
  discountPercentage: number;
  reqDeposite?: number;
};

type MarginSplit = {
  itemName: string;
  revenew: number;
  margin: number;
};

export function SubtotalBreakDown({
  subtotal,
  marginPercentage,
  taxPercentage,
  discountPercentage,
  reqDeposite,
  items: renderItems,
  paymentMethod,
}: SubtotalBreakDownProps) {
  const items = renderItems ?? [];
  const [tableOpen, toggleTableOpen] = useState(false);
  const [depositeDialog, toggleDepositeDialog] = useState(false);
  const [deposite, setDeposite] = useState(reqDeposite);

  const getSum = (
    info: HeaderContext<TableFeatures, MarginSplit>,
    col: string,
  ) => {
    return info.table
      .getFilteredRowModel()
      .rows.reduce((acc, row) => acc + (row.getValue<number>(col) || 0), 0);
  };

  const marginColumns: ColumnDef<TableFeatures, MarginSplit>[] = useMemo(
    () =>
      [
        {
          accessorKey: "itemName",
          header: "ITEM NAME",
          enableSorting: false,
          footer: () => <span className="font-bold"> Total </span>,
        },
        {
          accessorKey: "revenew",
          header: "REVENUE",
          enableSorting: false,
          cell: (info) => formatCurrency(info.getValue<number>()),
          footer: (info) => formatCurrency(getSum(info, "revenew")),
        },
        {
          id: "costs",
          header: "COSTS",
          accessorFn: (row) => row.revenew - (row.revenew * row.margin) / 100,
          cell: (info) => formatCurrency(info.row.getValue<number>("costs")),
          enableSorting: false,
          footer: (info) => formatCurrency(getSum(info, "costs")),
        },
        {
          id: "margin",
          header: "MARGIN",
          accessorFn: (row) => (row.revenew * row.margin) / 100,
          cell: (info) =>
            formatCurrency(info.row.getValue<number>("margin")) +
            ` (${info.row.original.margin}%)`,
          footer: (info) => {
            const sum = getSum(info, "margin");
            const revenue = getSum(info, "revenew");
            const percentage =
              revenue > 0 ? ((revenue - sum) * 100) / revenue : 0;
            return `${formatCurrency(sum)} (${percentage.toFixed(1)}%)`;
          },
          enableSorting: false,
        },
      ] as ColumnDef<TableFeatures, MarginSplit>[],
    [],
  );

  // Build margin data from QuoteLineItem — use unitCost to derive margin %
  const marginData: MarginSplit[] = items.map((item) => {
    const revenue = item.total; // pricePerUnit × quantity
    const cost = item.unitCost * item.quantity;
    const margin =
      revenue > 0 ? Math.round(((revenue - cost) / revenue) * 100) : 0;
    return { itemName: item.name, revenew: revenue, margin };
  });

  const applyPercentage = (base: number, percentage: number) =>
    (base * percentage) / 100;

  const renderProps = {
    subtotal,
    margin: marginPercentage,
    tax: taxPercentage,
    discount: discountPercentage,
  };

  let extraCharges = 0;

  return (
    <>
      <div className="flex flex-col p-5 gap-4">
        {Object.keys(renderProps).map((field) => {
          const key = field as keyof typeof renderProps;
          if (!["subtotal", "margin"].includes(field)) {
            extraCharges += applyPercentage(subtotal, renderProps[key]);
          }
          return (
            <div className="flex justify-between gap-4" key={field}>
              <span className="subtotal-field">
                {" "}
                {field} {field !== "subtotal" && `(${renderProps[key]}%)`}{" "}
              </span>
              <span className="subtotal-value">
                {field === "subtotal" && formatCurrency(subtotal)}
                {field === "margin" && (
                  <a
                    className="underline cursor-pointer"
                    onClick={() => toggleTableOpen((curr) => !curr)}
                  >
                    {" "}
                    Check Margin{" "}
                  </a>
                )}
                {!["subtotal", "margin"].includes(field) &&
                  formatCurrency(applyPercentage(subtotal, renderProps[key]))}
              </span>
            </div>
          );
        })}
        <div className="dashed-y-separators" />

        <div className="flex flex-col [&_div]:flex [&_div]:justify-between gap-4">
          <div>
            <span className="subtotal-field"> Grand Total </span>
            <span className="font-bold subtotal-value">
              {formatCurrency(subtotal + extraCharges)}
            </span>
          </div>

          <div className="dashed-y-separators" />

          {deposite ? (
            <div>
              <span className="subtotal-field"> Deposit Required </span>
              <span className="subtotal-value">
                {" "}
                {formatCurrency(deposite)}{" "}
              </span>
            </div>
          ) : (
            <a
              className="cursor-pointer"
              onClick={() => toggleDepositeDialog((curr) => !curr)}
            >
              {`+ Add Deposit`}
            </a>
          )}

          <div>
            <span className="subtotal-field"> Payment Method </span>
            <span className="subtotal-value"> {paymentMethod} </span>
          </div>
        </div>

        {paymentMethod === "Cash" && (
          <div className="flex gap-1.5 justify-start items-start h-fit">
            <img
              src={assets.warningIcon}
              className="w-4 h-4 aspect-square mt-1"
            />
            <span className="text-wrap wrap-break-word text-warning-text mt-0">
              {" "}
              {
                "Cash or offline payments should be completed directly and are not processed online."
              }{" "}
            </span>
          </div>
        )}
      </div>

      <CustomDialog
        dialogOpen={tableOpen}
        toggleDialogOpen={toggleTableOpen}
        header="Margin"
        withFooter
      >
        <CustomDataTable
          columns={marginColumns}
          data={marginData}
          showPaginated={marginData.length > 5}
        />
      </CustomDialog>

      <AddDeposite
        isOpen={depositeDialog}
        toggleOpen={toggleDepositeDialog}
        totalAmount={subtotal}
        setDeposite={setDeposite}
      />
    </>
  );
}
