import {
  createQuote,
  deleteAttachemnt,
  deleteQuote,
  updateQuote,
} from "@/api/services/quotes.api";
import type {
  CreateQuoteApiPayload,
  UpdateQuoteApiPayload,
} from "@/types/api.requests.type";
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

  return {
    quoteCreateMutation,
    quoteUpdateMutation,
    quoteDeleteMutation,
    attachmentDeleteMutation,
  };
}

export default useQuotesMutations;
