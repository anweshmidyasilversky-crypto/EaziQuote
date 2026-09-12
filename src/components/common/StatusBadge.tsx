import { type LucideIcon } from "lucide-react";
import type {
  ClientActivityStatus,
  PaymentActivityStatus,
  QuoteActivityStatus,
} from "../../constants/dummyData";
import type { InvoiceStatus } from "@/types/invoice.type";
import type { PaymentStatus } from "@/types/paymentRecord.type";
import type { QuoteStatus } from "@/types/api.responses.type";

export type StatusBadgeProps = {
  status:
    | "Sent"
    | "Paid"
    | "Overdue"
    | "Draft"
    | ClientActivityStatus
    | PaymentActivityStatus
    | QuoteActivityStatus
    | InvoiceStatus
    | PaymentStatus
    | QuoteStatus;

  ChevronIcon?: LucideIcon;
};

const statusColorMap: Record<StatusBadgeProps["status"], string> = {
  Sent: "bg-sent-badge",
  Paid: "bg-paid-badge",
  Overdue: "bg-overdue-badge",
  Draft: "bg-draft-badge",
  Rejected: "bg-overdue-badge",
  Due: "bg-draft-badge",
  Approved: "bg-paid-badge",
  Completed: "bg-paid-badge",
  Cancelled: "bg-paid-badge",
  Received: "bg-paid-badge",
  Pending: "bg-draft-badge",
  Failed: "bg-overdue-badge",
  Refunded: "bg-paid-badge",
  Accepted: "bg-paid-badge",
  Expired: "bg-overdue-badge",

  // Api res types
  failed: "bg-overdue-badge",
  received: "bg-paid-badge",
  pending: "bg-draft-badge",
  sent: "bg-sent-badge",
  //paid: "bg-paid-badge",
  //overdue: "bg-overdue-badge",
  draft: "bg-draft-badge",
  //rejected: "bg-overdue-badge",
  //due: "bg-draft-badge",
  approved: "bg-paid-badge",
  //completed: "bg-paid-badge",
  // cancelled: "bg-paid-badge",
  // received: "bg-paid-badge",
  // pending: "bg-draft-badge",
  // failed: "bg-overdue-badge",
  //refunded: "bg-paid-badge",
  accepted: "bg-paid-badge",
  //expired: "bg-overdue-badge"
};

const textColorMap: Record<StatusBadgeProps["status"], string> = {
  Sent: "text-sent-text",
  Paid: "text-paid-text",
  Overdue: "text-overdue-text",
  Draft: "text-draft-text",
  Rejected: "text-overdue-text",
  Due: "text-draft-text",
  Approved: "text-paid-text",
  Completed: "text-paid-text",
  Cancelled: "text-paid-text",

  Received: "text-paid-text",
  Pending: "text-draft-text",
  Failed: "text-overdue-text",
  Refunded: "text-paid-text",

  Accepted: "text-paid-text",
  Expired: "text-overdue-text",

  // Api res types
  failed: "text-overdue-text",
  received: "text-paid-text",
  pending: "text-draft-text",
  sent: "text-sent-text",
  // paid: "text-paid-text",
  // overdue: "text-overdue-text",
  draft: "text-draft-text",
  // rejected: "text-overdue-text",
  // due: "text-draft-text",
  approved: "text-paid-text",
  // completed: "text-paid-text",
  // cancelled: "text-paid-text",
  // received: "text-paid-text",
  // pending: "text-draft-text",
  // failed: "text-overdue-text",
  // refunded: "text-paid-text",
  accepted: "text-paid-text",
  // expired: "text-overdue-text",
};

function StatusBadge({ status, ChevronIcon }: StatusBadgeProps) {
  console.log(statusColorMap[status]);
  return (
    <div
      className={`flex justify-between px-2.5 min-h-6 w-fit rounded items-center ${statusColorMap[status]} ${textColorMap[status]}`}
    >
      <span> {status} </span>
      {ChevronIcon && (
        <div className="p-0.5 ml-1 mix-blend-multiply">
          <ChevronIcon className="w-5 aspect-square" />
        </div>
      )}
    </div>
  );
}

export default StatusBadge;
