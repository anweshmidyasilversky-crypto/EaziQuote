import { assets } from "../../assets/icons";
import type { ItemData, QuoteData } from "../../constants/dummyData";
import { formatCurrency } from "../../lib/utils";

export type SubtotalBreakDownProps = {
  paymentMethod: QuoteData["paymentMethod"];
  quote: QuoteData;
  itemDetails: ItemData[];
  taxPercentage: number;
  marginPercentage: number;
  discountPercentage: number;
  reqDeposite: number;
};
export function SubtotalBreakDown({
  quote,
  marginPercentage,
  taxPercentage,
  discountPercentage,
  reqDeposite,
  paymentMethod,
}: SubtotalBreakDownProps) {
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
            {field === "subtotal" && formatCurrency(quote.amount)}
            {field === "margin" && <a> Check Margin </a>}
            {!["subtotal", "margin"].includes(field) &&
              formatCurrency(applyPercentage(quote.amount, renderProps[key]))}
          </div>
        );
      })}
      <div className="dashed-y-separators" />

      <div className="flex flex-col [&_div]:flex [&_div]:justify-between gap-4">
        <div>
          <span className="subtotal-field"> Grand Total </span>
          <span className="font-bold">
            {formatCurrency(quote.amount + extraCharges)}
          </span>
        </div>

        <div className="dashed-y-separators" />

        <div>
          <span className="subtotal-field"> Deposite Required </span>
          <span> {formatCurrency(reqDeposite)} </span>
        </div>

        <div>
          <span className="subtotal-field"> Payment Method </span>
          <span> {paymentMethod} </span>
        </div>
      </div>

      {paymentMethod === "Cash" && (
        <div className="flex gap-1.5 justify-start items-start">
          <img
            src={assets.warningIcon}
            className="w-4 h-4 aspect-square mt-1"
          />
          <span className="min-h-51 text-wrap wrap-break-word text-warning-text mt-0">
            {" "}
            {
              "Cash or offline payments should be completed directly and are not processed online."
            }{" "}
          </span>
        </div>
      )}
    </div>
  );
}
