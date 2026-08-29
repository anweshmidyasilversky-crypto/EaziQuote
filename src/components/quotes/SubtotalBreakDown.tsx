import type {
  ColumnDef,
  HeaderContext,
  TableFeatures,
} from "@tanstack/react-table";
import { assets } from "../../assets/icons";
import type { ItemData, QuoteData } from "../../constants/dummyData";
import { formatCurrency } from "../../lib/utils";
import { useMemo, useState } from "react";
import CustomDialog from "../common/CustomDialog";
import { CustomDataTable } from "../common/CustomTable";

export type SubtotalBreakDownProps = {
  paymentMethod: QuoteData["paymentMethod"];
  quote: QuoteData;
  itemDetails: ItemData[];
  taxPercentage: number;
  marginPercentage: number;
  discountPercentage: number;
  reqDeposite: number;
};
type MarginSplit = {
  itemName: string;
  revenew: number;
  margin: number;
};

export function SubtotalBreakDown({
  quote,
  marginPercentage,
  taxPercentage,
  discountPercentage,
  reqDeposite,
  itemDetails,
  paymentMethod,
}: SubtotalBreakDownProps) {
  const [tableOpen, toggleTableOpen] = useState(false);
  console.log(itemDetails);
  const getSum = (
    info: HeaderContext<TableFeatures, MarginSplit>,
    col: string,
  ) => {
    console.log(info.table.getRowModel().rows[0].original);
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
          header: "REVENEW",
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
            `(${info.row.original.margin}%)`,
          footer: (info) => {
            const sum = getSum(info, "margin");
            const percentage =
              ((getSum(info, "revenew") - sum) * 100) / getSum(info, "revenew");
            return `${formatCurrency(sum)}(${percentage}%)`;
          },
          enableSorting: false,
        },
      ] as ColumnDef<TableFeatures, MarginSplit>[],
    [],
  );
  let marginData: MarginSplit[] = [];
  itemDetails.forEach((item) =>
    marginData.push({
      itemName: item.itemName,
      revenew: item.total,
      margin: Object.hasOwn(item, "margin")
        ? (item["margin" as keyof ItemData] as number)
        : 50,
    }),
  );
  console.log(`Margin Data: `, marginData);

  const renderProps = {
    subtotal: quote.amount,
    margin: marginPercentage,
    tax: taxPercentage,
    discount: discountPercentage,
  };
  const applyPercentage = (base: number, percentage: number) =>
    (base * percentage) / 100;
  let extraCharges = 0;
  return (
    <>
      <div className="flex flex-col p-5 gap-4">
        {Object.keys(renderProps).map((field) => {
          const key = field as keyof typeof renderProps;
          if (!["subtotal", "margin"].includes(field)) {
            extraCharges += applyPercentage(quote.amount, renderProps[key]);
          }
          return (
            <div className="flex justify-between" key={field}>
              <span className="subtotal-field">
                {" "}
                {field} {field !== "subtotal" && `(${renderProps[key]}%)`}{" "}
              </span>
              <span className="subtotal-value">
                {field === "subtotal" && formatCurrency(quote.amount)}
                {field === "margin" && (
                  <a
                    className="underline"
                    onClick={() => toggleTableOpen((curr) => !curr)}
                  >
                    {" "}
                    Check Margin{" "}
                  </a>
                )}
                {!["subtotal", "margin"].includes(field) &&
                  formatCurrency(
                    applyPercentage(quote.amount, renderProps[key]),
                  )}
              </span>
            </div>
          );
        })}
        <div className="dashed-y-separators" />

        <div className="flex flex-col [&_div]:flex [&_div]:justify-between gap-4">
          <div>
            <span className="subtotal-field"> Grand Total </span>
            <span className="font-bold subtotal-value">
              {formatCurrency(quote.amount + extraCharges)}
            </span>
          </div>

          <div className="dashed-y-separators" />

          <div>
            <span className="subtotal-field"> Deposite Required </span>
            <span className="subtotal-value">
              {" "}
              {formatCurrency(reqDeposite)}{" "}
            </span>
          </div>

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
    </>
  );
}
