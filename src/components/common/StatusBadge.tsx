import type { ClientActivityStatus } from "../../constants/dummyData";

export type StatusBadgeProps = {
  status: "Sent" | "Paid" | "Overdue" | "Draft" | ClientActivityStatus;
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
};

const textColorMap: Record<StatusBadgeProps["status"], string> = {
  Sent: "text-sent-text",
  Paid: "text-paid-text",
  Overdue: "text-overdue-text",
  Draft: "text-draft-text",
  Rejected: "text-overdue-badge",
  Due: "text-draft-badge",
  Approved: "text-paid-badge",
  Completed: "text-paid-badge",
  Cancelled: "text-paid-badge",
};

function StatusBadge({ status }: StatusBadgeProps) {
  console.log(statusColorMap[status]);
  return (
    <div
      className={`flex px-2.5 min-h-6 w-fit items-center ${statusColorMap[status]} ${textColorMap[status]}`}
    >
      <span> {status} </span>
    </div>
  );
}

export default StatusBadge;
