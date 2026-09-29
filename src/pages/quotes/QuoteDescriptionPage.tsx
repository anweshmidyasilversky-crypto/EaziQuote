import ReadMoreContentBox from "@/components/common/ReadMoreContentBox";
import StyledAttachments from "../../components/common/StyledAttachments";
import type { QuoteDetails } from "@/types/api.responses.type";

export type QuoteDescriptionPageProps = {
  quote?: QuoteDetails;
};

export function QuoteDescriptionPage({ quote }: QuoteDescriptionPageProps) {
  const jobDescription =
    quote?.job_description ||
    "This quote covers the full renovation and fit-out work, including material supply and installation services.";

  const notes =
    quote?.notes || "No internal notes have been recorded for this quote.";

  const attachments = quote?.attachments ?? [];

  return (
    <div className="bg-white rounded-[7px] flex flex-col gap-6 p-5">
      <ReadMoreContentBox
        title={"Job Description"}
        lines={9}
        contentBoxCls="p-0!"
      >
        {jobDescription}
      </ReadMoreContentBox>

      <div className="dashed-y-separators" />

      <ReadMoreContentBox
        title={"Notes (Not visible on quote)"}
        lines={9}
        contentBoxCls="p-0!"
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
            No attachments uploaded for this quote.
          </span>
        )}
      </div>
    </div>
  );
}
