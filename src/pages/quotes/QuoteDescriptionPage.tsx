import StyledAttachments from "../../components/common/StyledAttachments";
import type { Quote } from "../../types/quote.type";
import { useAppSelector } from "../../redux/store";
import { useParams } from "react-router";

export type QuoteDescriptionPageProps = {
  quote?: Quote;
};

export function QuoteDescriptionPage({ quote: propsQuote }: QuoteDescriptionPageProps = {}) {
  const params = useParams<{ id: string }>();
  const reduxQuote = useAppSelector((state) =>
    state.quotes.find((q) => q.id === params.id) ?? state.quotes[0],
  );

  const quote = propsQuote ?? reduxQuote;

  const jobDescription =
    quote?.jobDescription ||
    "This quote covers the full renovation and fit-out work, including material supply and installation services.";

  const notes =
    quote?.notes ||
    "No internal notes have been recorded for this quote.";

  const attachments = quote?.attachments ?? [];

  return (
    <div className="bg-white rounded-[7px] flex flex-col gap-6 p-5">
      <div className="quote-description-section">
        <span className="header"> Job Description </span>
        <span className="text-placeholder-text text-sm whitespace-pre-line">
          {jobDescription}
        </span>
      </div>

      <div className="dashed-y-separators" />

      <div className="quote-description-section">
        <span className="header"> Notes (Not visible on quote) </span>
        <span className="text-placeholder-text text-sm whitespace-pre-line">
          {notes}
        </span>
      </div>

      <div className="dashed-y-separators" />

      <div className="quote-description-section">
        <span className="header"> Attachments </span>
        {attachments.length > 0 ? (
          <div className="attachment-layout">
            {attachments.map((att, idx) => (
              <StyledAttachments
                key={att.name ?? idx}
                fileName={att.name}
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

