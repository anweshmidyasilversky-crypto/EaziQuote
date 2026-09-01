import type {
  ColumnDef,
  HeaderContext,
  TableFeatures,
} from "@tanstack/react-table";
import { assets } from "../../assets/icons";
import type { QuoteLineItem } from "../../types/quoteLineItem.type";
import { formatCurrency } from "../../lib/utils";
import { useMemo, useState } from "react";
import CustomDialog from "../common/CustomDialog";
import { CustomDataTable } from "../common/CustomTable";
import AddDeposite from "./AddDeposite";
import { PaymentMethods } from "@/types/addDeposite.payload.type";
import { useLocation } from "react-router";
import { CustomActionGroup } from "../common/CustomActionGroup";
import AddDiscount from "./AddDiscount";

export type SubtotalBreakDownProps = {
  paymentMethod: PaymentMethods;
  items: QuoteLineItem[];
  taxPercentage: number;
  discountPercentage?: number;
  reqDeposite?: number;
};

type MarginSplit = {
  itemName: string;
  revenew: number;
  margin: number;
  costs: number;
};

export function SubtotalBreakDown({
  taxPercentage,
  discountPercentage: discount,
  reqDeposite,
  items: renderItems,
  paymentMethod: paymentMode,
}: SubtotalBreakDownProps) {
  const location = useLocation();
  const items = renderItems ?? [];
  const [tableOpen, toggleTableOpen] = useState(false);
  const [depositeDialog, toggleDepositeDialog] = useState(false);
  const [deposite, setDeposite] = useState(reqDeposite);
  const [discountDialog, toggleDiscountDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(paymentMode);
  const [discountPercentage, setDiscountPercentage] = useState(discount);

  const isEditPage = location.pathname.split("/").includes("manage-quotes");

  const subtotal = useMemo(
    () =>
      items.reduce((acc, prev) => acc + prev.pricePerUnit * prev.quantity, 0),
    [items],
  );
  const overallCost = useMemo(
    () => items.reduce((acc, prev) => acc + prev.quantity * prev.unitCost, 0),
    [items],
  );
  const marginPercentage = useMemo(() => {
    const ret = Math.round(((subtotal - overallCost) / subtotal) * 10000) / 100;
    console.log(ret);
    return ret;
  }, [items]);

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
          accessorKey: "costs",
          header: "COSTS",
          cell: (info) => formatCurrency(info.row.getValue<number>("costs")),
          enableSorting: false,
          footer: (info) => formatCurrency(getSum(info, "costs")),
        },
        {
          id: "margin",
          header: "MARGIN",
          accessorFn: (row) => ((row.revenew - row.costs) / row.revenew) * 100,
          cell: (info) => {
            const row = info.row;
            const margin =
              ((row.original.revenew - row.original.costs) /
                row.original.revenew) *
              100;
            return (
              formatCurrency(row.original.revenew - row.original.costs) +
              ` (${Math.round(margin * 10) / 10}%)`
            );
          },
          footer: (info) => {
            const sum = getSum(info, "costs");
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
    return { itemName: item.name, revenew: revenue, margin, costs: cost };
  });

  const applyPercentage = (base: number, percentage: number) =>
    (base * percentage) / 100;

  const renderProps = {
    subtotal,
    margin: Number.isNaN(marginPercentage) ? 0 : marginPercentage,
    tax: taxPercentage,
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

        <div className="mt-4 flex gap-4 items-center justify-between">
          <span className="subtotal-field">
            {" "}
            {discountPercentage
              ? `discount(${discountPercentage}%)`
              : `discount`}{" "}
          </span>

          <div className="flex gap-2 items-center">
            {discountPercentage ? (
              <span className="subtotal-value">
                {" "}
                {formatCurrency(
                  applyPercentage(subtotal, discountPercentage),
                )}{" "}
              </span>
            ) : (
              <a
                className="subtotal-value"
                onClick={() => toggleDiscountDialog((curr) => !curr)}
              >
                {" "}
                {`+ Add Discount`}{" "}
              </a>
            )}

            {isEditPage && discountPercentage && (
              <CustomActionGroup
                withOpen={false}
                editFn={() => toggleDiscountDialog((curr) => !curr)}
              />
            )}
          </div>
        </div>

        <div className="dashed-y-separators" />

        <div className="flex flex-col [&_div]:flex [&_div]:justify-between gap-4">
          <div>
            <span className="subtotal-field"> Grand Total </span>
            <span className="font-bold subtotal-value">
              {formatCurrency(
                subtotal +
                  extraCharges -
                  applyPercentage(subtotal, discountPercentage ?? 0),
              )}
            </span>
          </div>
          <div className="dashed-y-separators" />
          <div className="w-full justify-between gap-4 items-center">
            <span className="subtotal-field">
              {" "}
              {deposite ? `Deposit Required` : `Deposite`}{" "}
            </span>

            <div className="flex gap-2 items-center">
              {deposite ? (
                <span className="subtotal-value">
                  {" "}
                  {formatCurrency(deposite)}{" "}
                </span>
              ) : (
                <a
                  className="cursor-pointer subtotal-value"
                  onClick={() => toggleDepositeDialog((curr) => !curr)}
                >
                  {`+ Add Deposit`}
                </a>
              )}

              {isEditPage && deposite && (
                <CustomActionGroup
                  withOpen={false}
                  editFn={() => toggleDepositeDialog((curr) => !curr)}
                />
              )}
            </div>
          </div>

          {deposite && (
            <div>
              <span className="subtotal-field"> Payment Method </span>
              <span className="subtotal-value"> {paymentMethod} </span>
            </div>
          )}
        </div>

        {deposite && paymentMethod === PaymentMethods.cash && (
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
        setPaymentMode={setPaymentMethod}
        defaultValues={{
          paymentMethod: paymentMethod ?? PaymentMethods.stripe,
          deposite: deposite ?? undefined,
        }}
      />

      <AddDiscount
        isOpen={discountDialog}
        toggleIsOpen={toggleDiscountDialog}
        setDiscount={setDiscountPercentage}
      />
    </>
  );
}
