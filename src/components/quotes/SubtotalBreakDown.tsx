import type {
  ColumnDef,
  HeaderContext,
  TableFeatures,
} from "@tanstack/react-table";
import { assets } from "../../assets/icons";
import { formatCurrency } from "../../lib/utils";
import { useEffect, useMemo, useState } from "react";
import CustomDialog from "../common/CustomDialog";
import { CustomDataTable } from "../common/CustomTable";
import AddDeposite from "./AddDeposite";
import { useLocation } from "react-router";
import { CustomActionGroup } from "../common/CustomActionGroup";
import AddDiscount from "./AddDiscount";
import { PaymentMethods, type Vat } from "@/types/api.responses.type";
import AddTax from "./AddTax";
import type { DepositeTypes } from "@/types/api.requests.type";
import { useAppSelector } from "@/redux/store";
import StripeAdvisoryDialog from "@/pages/settings/StripeAdvisoryDialog";

export type SubtotalBreakDownProps = {
  paymentMethod: PaymentMethods;
  items: {
    quantity: number;
    type: string;
    price: number;
    cost: number;
    name: string;
  }[];
  taxPercentage?: number;
  discountPercentage?: number;
  reqDeposite?: number;
  vatSettings?: Vat[];

  taxIdRef?: React.RefObject<number | undefined>;
  discountRef?: React.RefObject<number | null>;
  depositePaymentMethodRef?: React.RefObject<PaymentMethods>;
  depositeAmountRef?: React.RefObject<number | null>;
  depositeTypeRef?: React.RefObject<DepositeTypes | null>;
  depositePercentageRef?: React.RefObject<number | null>;
};

type MarginSplit = {
  itemName: string;
  revenew: number;
  margin: number;
  costs: number;
};

export function SubtotalBreakDown({
  taxPercentage,
  discountPercentage: initialDiscountPercentage,
  reqDeposite,
  items: renderItems,
  paymentMethod: paymentMode,
  vatSettings,

  taxIdRef,
  discountRef,
  depositePaymentMethodRef,
  depositeAmountRef,
  depositeTypeRef,
  depositePercentageRef,
}: SubtotalBreakDownProps) {
  const location = useLocation();
  const items = renderItems ?? [];
  const [tableOpen, toggleTableOpen] = useState(false);
  const [depositeDialog, toggleDepositeDialog] = useState(false);
  // Source of truth is the prop the parent computes from the quote — this
  // component doesn't reach into redux itself, so there's only ever one
  // place that derives these values.
  const [deposite, setDeposite] = useState(reqDeposite);
  const [discountDialog, toggleDiscountDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(paymentMode);
  const [discountPercentage, setDiscountPercentage] = useState(
    initialDiscountPercentage,
  );
  const [tax, setTax] = useState(taxPercentage);
  const [stripConnectPopupOpen, toggleStripConnectPopup] = useState(false);
  const [taxModalOpen, toggleTaxModalOpen] = useState(false);
  const user = useAppSelector((state) => state.user);

  // One-time sync on mount: the parent creates these refs with their own
  // defaults/derived values, which may not match this component's actual
  // first-render state. After mount, each ref is kept in sync directly at
  // the point where its own modal changes its value (see handlers below) —
  // not through a shared effect keyed on multiple unrelated values.
  useEffect(() => {
    if (depositeAmountRef) {
      depositeAmountRef.current = deposite ?? null;
    }
    if (depositePaymentMethodRef) {
      depositePaymentMethodRef.current = paymentMethod;
    }
    if (discountRef) {
      discountRef.current = discountPercentage ?? null;
    }
  }, []);

  const isEditPage = location.pathname.split("/").includes("manage-quotes");

  const subtotal = useMemo(
    () => items.reduce((acc, prev) => acc + prev.price * prev.quantity, 0),
    [items],
  );
  const overallCost = useMemo(
    () => items.reduce((acc, prev) => acc + prev.quantity * prev.cost, 0),
    [items],
  );
  const marginPercentage = useMemo(() => {
    if (subtotal === 0) {
      return 0;
    }
    return Math.round(((subtotal - overallCost) / subtotal) * 10000) / 100;
  }, [subtotal, overallCost]);

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
          accessorFn: (row) =>
            row.revenew > 0
              ? ((row.revenew - row.costs) / row.revenew) * 100
              : 0,
          cell: (info) => {
            const row = info.row;
            const margin =
              row.original.revenew > 0
                ? ((row.original.revenew - row.original.costs) /
                    row.original.revenew) *
                  100
                : 0;
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
    const revenue = item.price * item.quantity; // pricePerUnit × quantity
    const cost = (item.cost ?? 0) * item.quantity;
    const margin =
      revenue > 0 ? Math.round(((revenue - cost) / revenue) * 100) : 0;
    return { itemName: item.name, revenew: revenue, margin, costs: cost };
  });

  const applyPercentage = (base: number, percentage: number) =>
    (base * percentage) / 100;

  const renderProps = {
    subtotal,
    margin: Number.isNaN(marginPercentage) ? 0 : marginPercentage,
  };

  let extraCharges = 0;

  // --- Deposit: ref writes happen where the deposit modal actually
  // changes the value, instead of via a shared effect. ---
  const handleSetDeposite = (amount: number | undefined) => {
    setDeposite(amount);
    if (depositeAmountRef) {
      depositeAmountRef.current = amount ?? null;
    }
  };

  const handleSetPaymentMethod = (method: PaymentMethods) => {
    setPaymentMethod(method);
    if (depositePaymentMethodRef) {
      depositePaymentMethodRef.current = method;
    }
  };

  const handleRemoveDeposite = () => {
    setDeposite(undefined);
    if (depositeAmountRef) {
      depositeAmountRef.current = null;
    }
    if (depositeTypeRef) {
      depositeTypeRef.current = null;
    }
    if (depositePercentageRef) {
      depositePercentageRef.current = null;
    }
  };

  const handleDepositeType = (depositeType: DepositeTypes) => {
    if (depositeTypeRef) {
      depositeTypeRef.current = depositeType;
    }
  };

  const handleDepositePercentage = (percentage: number | null) => {
    if (depositePercentageRef) {
      depositePercentageRef.current = percentage;
    }
  };

  // --- Discount: same pattern. ---
  const handleSetDiscount = (percentage: number | undefined) => {
    setDiscountPercentage(percentage);
    if (discountRef) {
      discountRef.current = percentage ?? 0;
    }
  };

  // --- Tax: same pattern. Ref only tracks an actively-selected tax id,
  // consistent with how it's looked up upstream (find-by-id with a
  // fallback), so removing the tax clears local state but intentionally
  // leaves the last known id ref alone. ---
  const handleSetTax = (vat: Vat | undefined) => {
    if (vat) {
      setTax(Number(vat.value));
      if (taxIdRef) {
        taxIdRef.current = vat.id;
      }
    } else {
      if (taxIdRef) {
        setTax(0);
        taxIdRef.current = undefined;
      }
    }
    console.log(`Deletion completed`);
  };

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
                {field[0].toUpperCase() + field.slice(1)}{" "}
                {field !== "subtotal" && `(${renderProps[key]}%)`}{" "}
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
        <div className="flex justify-between items-center gap-4">
          <span className="subtotal-field"> {`Tax(${tax ?? 0}%)`} </span>
          <div className="flex gap-2 items-center">
            {tax !== undefined ? (
              <span className="subtotal-value">
                {" "}
                {formatCurrency(applyPercentage(subtotal, tax ?? 0))}{" "}
              </span>
            ) : (
              <a
                className="subtotal-value"
                onClick={() => toggleTaxModalOpen((curr) => !curr)}
              >
                {`+ Select Tax Rate`}
              </a>
            )}
            {isEditPage && tax !== undefined && (
              <CustomActionGroup
                withOpen={false}
                editFn={() => toggleTaxModalOpen((curr) => !curr)}
                deleteFn={() => handleSetTax(undefined)}
              />
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-4 items-center justify-between">
          <span className="subtotal-field">
            {" "}
            {`Discount` +
              (discountPercentage ? `(${discountPercentage}%)` : ``)}{" "}
          </span>

          <div className="flex gap-2 items-center">
            {discountPercentage !== undefined ? (
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

            {isEditPage && discountPercentage !== undefined && (
              <CustomActionGroup
                withOpen={false}
                editFn={() => toggleDiscountDialog((curr) => !curr)}
                deleteFn={() => handleSetDiscount(undefined)}
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
                  applyPercentage(subtotal, tax ?? 0) +
                  extraCharges -
                  applyPercentage(subtotal, discountPercentage ?? 0),
              )}
            </span>
          </div>
          <div className="dashed-y-separators" />
          <div className="w-full justify-between gap-4 items-center">
            <span className="subtotal-field">
              {" "}
              {deposite
                ? `Deposit Required`
                : isEditPage
                  ? `Deposite`
                  : ``}{" "}
            </span>

            <div className="flex gap-2 items-center">
              {deposite ? (
                <span className="subtotal-value">
                  {" "}
                  {formatCurrency(deposite)}{" "}
                </span>
              ) : (
                <>
                  {isEditPage && (
                    <a
                      className="cursor-pointer subtotal-value"
                      onClick={() => toggleDepositeDialog((curr) => !curr)}
                    >
                      {`+ Add Deposit`}
                    </a>
                  )}
                </>
              )}

              {isEditPage && deposite && (
                <CustomActionGroup
                  withOpen={false}
                  editFn={() => toggleDepositeDialog((curr) => !curr)}
                  deleteFn={handleRemoveDeposite}
                />
              )}
            </div>
          </div>

          {deposite && (
            <div>
              <span className="subtotal-field"> Payment Method </span>
              <span className="subtotal-value">
                {" "}
                {user.stripe_connected
                  ? PaymentMethods.stripe
                  : PaymentMethods.cash}{" "}
              </span>
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
        setDeposite={handleSetDeposite}
        setPaymentMode={handleSetPaymentMethod}
        defaultValues={{
          paymentMethod:
            paymentMethod ??
            (user.stripe_connected
              ? PaymentMethods.stripe
              : PaymentMethods.cash),
          deposite: deposite ?? undefined,
        }}
        handleDepositeType={handleDepositeType}
        handleDepositePercentage={handleDepositePercentage}
        toggleStripPopup={toggleStripConnectPopup}
      />

      <AddDiscount
        isOpen={discountDialog}
        toggleIsOpen={toggleDiscountDialog}
        setDiscount={handleSetDiscount}
      />

      <AddTax
        isOpen={taxModalOpen}
        toggleIsOpen={toggleTaxModalOpen}
        vatSettings={vatSettings ?? []}
        setTaxId={handleSetTax}
      />

      <StripeAdvisoryDialog
        isOpen={stripConnectPopupOpen}
        toggleIsOpen={toggleStripConnectPopup}
        type="connect"
      />
    </>
  );
}
