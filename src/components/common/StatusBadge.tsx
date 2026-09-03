import { type LucideIcon } from "lucide-react";
import type {
  ClientActivityStatus,
  PaymentActivityStatus,
  QuoteActivityStatus,
} from "../../constants/dummyData";
import type { InvoiceStatus } from "@/types/invoice.type";

export type StatusBadgeProps = {
  status:
    | "Sent"
    | "Paid"
    | "Overdue"
    | "Draft"
    | ClientActivityStatus
    | PaymentActivityStatus
    | QuoteActivityStatus
    | InvoiceStatus;

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
