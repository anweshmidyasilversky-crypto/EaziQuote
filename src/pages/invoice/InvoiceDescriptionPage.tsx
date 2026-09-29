import ReadMoreContentBox from "@/components/common/ReadMoreContentBox";
import StyledAttachments from "../../components/common/StyledAttachments";
import type { InvoiceDetails } from "@/types/api.responses.type";
import { cn } from "@/lib/utils";
import useQuotesMutations from "@/hooks/apis/quotes/useQuotesMutations";
import { toast } from "react-toastify";
import { showErrorToast } from "@/api/axiosInstance";

export type InvoiceDescriptionPageProps = {
  invoice: InvoiceDetails | undefined;
  onMutate?: () => void;
};

export function InvoiceDescriptionPage({
  invoice,
  onMutate,
}: InvoiceDescriptionPageProps) {
  const jobDescription = invoice?.message;

  const notes = invoice?.notes;

  const attachments = invoice?.attachments ?? [];

  const { attachmentDeleteMutation } = useQuotesMutations();

  const handleAttachmentDelete = (quote_id: number, attachment_id: number) => {
    attachmentDeleteMutation.mutate(
      {
        quote_id,
        attachment_id,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          onMutate?.();
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

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
                deleteAction={() =>
                  handleAttachmentDelete(invoice?.quote.id ?? 0, att.id)
                }
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
