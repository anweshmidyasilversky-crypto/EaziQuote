import {
  createQuote,
  deleteAttachemnt,
  deleteQuote,
  duplicateQuote,
  updateQuote,
  updateStatus,
} from "@/api/services/quotes.api";
import type {
  CreateQuoteApiPayload,
  UpdateQuoteApiPayload,
} from "@/types/api.requests.type";
import type { QuoteStatus } from "@/types/api.responses.type";
import { useMutation } from "@tanstack/react-query";

function useQuotesMutations() {
  const quoteDeleteMutation = useMutation({
    mutationKey: ["quote_delete"],
    mutationFn: (quote_id: string | number) => deleteQuote(quote_id),
  });

  const attachmentDeleteMutation = useMutation({
    mutationKey: ["quote", "delete_attachment"],
    mutationFn: (data: {
      quote_id: string | number;
      attachment_id: string | number;
    }) => deleteAttachemnt(data),
  });

  const quoteUpdateMutation = useMutation({
    mutationKey: ["quote_update"],
    mutationFn: (data: UpdateQuoteApiPayload) => updateQuote(data),
  });

  const quoteCreateMutation = useMutation({
    mutationKey: ["quote_create"],
    mutationFn: (payload: CreateQuoteApiPayload) => createQuote(payload),
  });

  const quoteDuplicateMutation = useMutation({
    mutationKey: ["quote_duplicate"],
    mutationFn: (quote_id: string | number) => duplicateQuote(quote_id),
  });

  const statusUpdateMutation = useMutation({
    mutationKey: ["update_status"],
    mutationFn: (payload: { quote_id: string | number; status: QuoteStatus }) =>
      updateStatus(payload.quote_id, payload.status),
  });

  return {
    quoteCreateMutation,
    quoteUpdateMutation,
    quoteDeleteMutation,
    attachmentDeleteMutation,
    quoteDuplicateMutation,
    statusUpdateMutation,
  };
}

export default useQuotesMutations;
