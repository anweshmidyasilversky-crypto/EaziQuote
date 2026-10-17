import { useSubtotalFields } from "@/context/SubtotalFieldsContext";
import {
  applyPercentage,
  calcMarginPercentage,
  cn,
  formatCurrency,
} from "@/lib/utils";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Separator } from "../ui/separator";
import CustomDialog from "../common/CustomDialog";
import { CustomDataTable } from "../common/CustomTable";
import {
  DepositeTypes,
  type UpdateQuoteItems,
} from "@/types/api.requests.type";
import { useLocation } from "react-router";
import { CustomActionGroup } from "../common/CustomActionGroup";
import AddTax from "./AddTax";
import { useAppSelector } from "@/redux/store";
import AddDiscount from "./AddDiscount";
import AddDeposite from "./AddDeposite";
import StripeAdvisoryDialog from "@/pages/settings/StripeAdvisoryDialog";
import { PaymentMethods } from "@/types/api.responses.type";
import PaymentMethodSelectDialog from "../invoices/PaymentMethodSelectDialog";
import { assets } from "@/assets/icons";

export type SubtotalBreakDownProps = {
  items: UpdateQuoteItems[];
  depositReceived?: boolean;
  isPreview?: boolean;
};

export interface Margin {
  itemName: string;
  revenue: number;
  margin: number;
  costs: number;
}

function SubtotalBreakDown({
  items,
  depositReceived,
  isPreview,
}: SubtotalBreakDownProps) {
  const {
    company: { brand_color },
  } = useAppSelector((state) => state.user);
  const previewFieldStyle: React.CSSProperties = {
    color: brand_color,
  };
  const {
    creditAmount,
    vat,
    discount,
    depositAmount,
    paymentMethod,
    depositType,
    depositPercentage,
    setDepositPercentage,
    setDepositType,
    setDepositAmount,
    setVat,
    setDiscount,
    setPaymentMethod,
  } = useSubtotalFields();
  const user = useAppSelector((state) => state.user);
  const { vat_settings } = useAppSelector((state) => state.appConfig);
  const location = useLocation();
  const isEditPage =
    location.pathname.split("/").includes("manage-quotes") ||
    location.pathname.split("/").includes("manage-invoice");
  const quotePage = location.pathname.split("/").includes("quotes");
  const invoicePage = location.pathname.split("/").includes("invoices");

  {
    /* Modal Open handling states */
  }
  const [tableOpen, setTableOpen] = useState(false);
  const [taxAddModalOpen, setTaxAddModalOpen] = useState(false);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [stripeModalOpen, setStripeModalOpen] = useState(false);
  const [paymentMethodModalOpen, setPaymentMethodModalOpen] = useState(false);

  const subtotal = useMemo(() => {
    return items.reduce((curr, item) => curr + item.price * item.quantity, 0);
  }, [items]);

  const totalCost = useMemo(() => {
    return items.reduce((curr, item) => curr + item.cost * item.quantity, 0);
  }, [items]);

  const grandTotal = useMemo(() => {
    return (
      subtotal +
      applyPercentage(subtotal, Number(vat?.value ?? "0")) -
      applyPercentage(subtotal, discount ?? 0) -
      (creditAmount ?? 0)
    );
  }, [vat, discount, creditAmount, subtotal]);

  const discountAmount = useMemo(() => {
    if (!discount || discount === 0) {
      return 0;
    }
    return applyPercentage(
      subtotal +
        applyPercentage(subtotal, Number(vat?.value ?? "0")) -
        (creditAmount ?? 0),
      discount,
    );
  }, [subtotal, vat, discount]);

  const marginColumns: ColumnDef<TableFeatures, UpdateQuoteItems>[] = [
    {
      id: "itemName",
      header: "Item Name",
      accessorFn: (item) => item.name,
      enableSorting: false,
    },
    {
      id: "revenue",
      header: "revenue",
      accessorFn: (item) => item.price * item.quantity,
      enableSorting: false,
    },
    {
      id: "cost",
      header: "cost",
      accessorFn: (item) => item.cost * item.quantity,
      enableSorting: false,
    },
    {
      id: "margin",
      header: "Margin",
      cell: (info) => {
        const { price, quantity, cost } = info.row.original;
        const revenue = price * quantity;
        if (revenue > 0) {
          const margin = Math.round(((price - cost) / price) * 100);
          return `${formatCurrency((price - cost) * quantity)} (${margin}%)`;
        }
        return `${formatCurrency(0)} (0%)`;
      },
    },
  ];

  return (
    <div className="flex flex-col px-5 gap-4 [&>div]:subtotal-row [&_#field]:subtotal-field [&_#value]:subtotal-value">
      {/* Subtotal */}
      <div>
        <span id="field" style={isPreview ? previewFieldStyle : {}}>
          {" "}
          {`Subtotal`}{" "}
        </span>
        <span id="value"> {formatCurrency(subtotal)} </span>
      </div>

      {/* Margin */}
      {!isPreview && (
        <div>
          <span id="field">
            {" "}
            {`Margin (${calcMarginPercentage(subtotal, totalCost)}%)`}{" "}
          </span>
          <a
            onClick={() => setTableOpen(true)}
            className="text-brand-dark text-[14px] underline decoration-brand-dark"
          >
            {" "}
            {"Check Margin"}{" "}
          </a>
        </div>
      )}

      {/* Tax */}
      <div>
        <span id="field" style={isPreview ? previewFieldStyle : {}}>
          {" "}
          {`Tax ${vat ? `(${vat.value}%)` : ``}`}{" "}
        </span>
        <span id="value">
          {" "}
          {vat
            ? formatCurrency(applyPercentage(subtotal, Number(vat.value)))
            : formatCurrency(0)}{" "}
          {isEditPage && quotePage && !isPreview && (
            <CustomActionGroup
              withOpen={false}
              editFn={() => setTaxAddModalOpen(true)}
              withDelete={false}
            />
          )}
        </span>
      </div>

      {/* Deposit for live preview section */}
      {isPreview && depositAmount && (
        <div>
          <span id="field" style={previewFieldStyle}>{`Deposit`}</span>
          <span id="value"> {formatCurrency(depositAmount)}</span>
        </div>
      )}

      {/* Discount */}
      <div>
        <span id="field" style={isPreview ? previewFieldStyle : {}}>
          {" "}
          {`Discount ${discount ? `(${discount})%` : ``}`}{" "}
        </span>
        <span id="value">
          {" "}
          {formatCurrency(discountAmount)}
          {isEditPage && !isPreview && (
            <CustomActionGroup
              withOpen={false}
              editFn={() => setDiscountModalOpen(true)}
              withDelete={false}
            />
          )}
        </span>
      </div>

      <Separator
        className={cn(
          !isPreview ? `dashed-y-separators` : `bg-preview-section-separator`,
        )}
      />

      {/* Grand total */}
      <div>
        <span
          id="field"
          style={isPreview ? { ...previewFieldStyle, fontWeight: "bold" } : {}}
        >
          {" "}
          {isPreview ? `Total` : `Grand Total`}{" "}
        </span>
        <span id="value"> {formatCurrency(grandTotal)} </span>
      </div>

      {isPreview && <Separator className={`bg-preview-section-separator`} />}

      {/* Deposit */}
      {(isEditPage || (quotePage && depositAmount)) &&
        quotePage &&
        !isPreview && (
          <div>
            <span id="field">
              {" "}
              {`Deposit ${depositReceived ? `Received` : `Required`}`}{" "}
            </span>
            {depositAmount ? (
              <span id="value">
                {" "}
                {formatCurrency(depositAmount)}
                {isEditPage && (
                  <CustomActionGroup
                    withOpen={false}
                    editFn={() => setDepositModalOpen(true)}
                    deleteFn={() => {
                      setDepositAmount(undefined);
                      setDepositPercentage(undefined);
                      setDepositType(undefined);
                    }}
                  />
                )}
              </span>
            ) : (
              <a
                className="text-brand-dark underline decoration-brand-dark text-[14px]"
                onClick={() => setDepositModalOpen(true)}
              >
                {" "}
                {"+ Add Deposit"}{" "}
              </a>
            )}
          </div>
        )}

      {((depositAmount && paymentMethod) || invoicePage) && !isPreview && (
        <div className="subtotal-row">
          <span id={`field`}> {"Payment Method"} </span>
          <span id={`value`}>
            {" "}
            {paymentMethod}{" "}
            {isEditPage && invoicePage && (
              <CustomActionGroup
                withDelete={false}
                withOpen={false}
                editFn={() => setPaymentMethodModalOpen(true)}
              />
            )}{" "}
          </span>
        </div>
      )}

      {((depositAmount && paymentMethod) || invoicePage) &&
        !isPreview &&
        paymentMethod === PaymentMethods.cash && (
          <div className="flex gap-1.5 h-fit items-center">
            <img
              src={assets.warningIcon}
              className="w-4 h-4 aspect-square self-start mt-1"
            />
            <span className="text-wrap wrap-break-word text-warning-text text-[14px]">
              {" "}
              {
                "Cash or offline payments should be completed directly and are not processed online."
              }{" "}
            </span>
          </div>
        )}

      {/* Margin Table */}
      <CustomDialog
        dialogOpen={tableOpen}
        toggleDialogOpen={setTableOpen}
        header="Margin"
        withFooter
      >
        <CustomDataTable
          columns={marginColumns}
          data={items}
          bodyCls={cn(`overflow-auto`)}
          contentScrollable
        />
      </CustomDialog>

      {/* Tax modal */}
      <AddTax
        isOpen={taxAddModalOpen}
        toggleIsOpen={setTaxAddModalOpen}
        vatSettings={vat_settings}
        setTaxId={setVat}
        prefillTax={vat}
      />

      <AddDiscount
        isOpen={discountModalOpen}
        toggleIsOpen={setDiscountModalOpen}
        setDiscount={setDiscount}
        defaultValues={{
          discount,
        }}
      />

      <AddDeposite
        isOpen={depositModalOpen}
        toggleOpen={setDepositModalOpen}
        setDeposite={setDepositAmount}
        totalAmount={grandTotal}
        setPaymentMode={setPaymentMethod}
        toggleStripPopup={setStripeModalOpen}
        defaultValues={{
          paymentMethod: paymentMethod ?? PaymentMethods.cash,
          deposite:
            depositType === DepositeTypes.fixed
              ? depositAmount
              : depositPercentage,
        }}
        depositeType={depositType}
        handleDepositeType={setDepositType}
        handleDepositePercentage={setDepositPercentage}
      />

      <PaymentMethodSelectDialog
        isOpen={paymentMethodModalOpen}
        toggleOpen={setPaymentMethodModalOpen}
        selectedMethod={paymentMethod ?? PaymentMethods.cash}
        toggleSelectedMethod={(method) =>
          setPaymentMethod(method as PaymentMethods)
        }
        isStipeConnected={user.stripe_account_status === "active"}
      />

      <StripeAdvisoryDialog
        isOpen={stripeModalOpen}
        toggleIsOpen={setStripeModalOpen}
        type="connect"
      />
    </div>
  );
}

export default SubtotalBreakDown;
