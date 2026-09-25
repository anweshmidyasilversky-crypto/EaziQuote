import {
  createPresetQuote,
  deletePresetQuote,
  updatePresetQuote,
} from "@/api/services/auth.api";
import type {
  CreatePresetQuote,
  UpdatePresetQuote,
} from "@/types/api.requests.type";
import { useMutation } from "@tanstack/react-query";

function usePresetQuoteMutations() {
  const presetQuoteDeleteMutation = useMutation({
    mutationKey: ["preset_delete"],
    mutationFn: (templateId: string | number) => deletePresetQuote(templateId),
  });

  const presetQuoteCreateMutation = useMutation({
    mutationKey: ["preset_create"],
    mutationFn: (payload: CreatePresetQuote) => createPresetQuote(payload),
  });

  const presetQuoteUpdateMutation = useMutation({
    mutationKey: ["preset_update"],
    mutationFn: (payload: UpdatePresetQuote) => updatePresetQuote(payload),
  });

  return {
    presetQuoteCreateMutation,
    presetQuoteUpdateMutation,
    presetQuoteDeleteMutation,
  };
}

export default usePresetQuoteMutations;
