import ReadMoreContentBox from "@/components/common/ReadMoreContentBox";
import StyledAttachments from "../../components/common/StyledAttachments";
import type { InvoiceDetails } from "@/types/api.responses.type";
import { cn } from "@/lib/utils";

export type InvoiceDescriptionPageProps = {
  invoice: InvoiceDetails | undefined;
};

export function InvoiceDescriptionPage({
  invoice,
}: InvoiceDescriptionPageProps) {
  const jobDescription = invoice?.message;

  const notes = invoice?.notes;

  const attachments = invoice?.attachments ?? [];

  return (
    <div className="bg-white rounded-[7px] flex flex-col gap-6 p-5 dashboard-card-theme">
      <ReadMoreContentBox
        title="Project / Services Notes"
        lines={9}
        contentBoxCls={cn(`p-0!`)}
      >
        {jobDescription}
      </ReadMoreContentBox>

      <div className="dashed-y-separators" />

      <ReadMoreContentBox
        title="Notes (Not visible on invoice)"
        lines={9}
        contentBoxCls={cn(`p-0!`)}
      >
        {notes}
      </ReadMoreContentBox>

      <div className="dashed-y-separators" />

      <div className="quote-description-section">
        <span className="header"> Attachments </span>
        {attachments.length > 0 ? (
          <div className="attachment-layout">
            {attachments.map((att, idx) => (
              <StyledAttachments
                key={att.id ?? idx}
                fileName={att.id.toString()}
              />
            ))}
          </div>
        ) : (
          <span className="text-placeholder-text text-sm">
            No attachments uploaded for this invoice.
          </span>
        )}
      </div>
    </div>
  );
}
