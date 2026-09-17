import { deleteQuote } from "@/api/services/quotes.api";
import { useMutation } from "@tanstack/react-query";

function useQuotesMutations() {
  const quoteDeleteMutation = useMutation({
    mutationKey: ["quote_delete"],
    mutationFn: (quote_id: string | number) => deleteQuote(quote_id),
  });

  return {
    quoteDeleteMutation,
  };
}

export default useQuotesMutations;
