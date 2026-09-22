import {
  createOrUpdateSectionForQuote,
  createSection,
  deleteSection,
  deleteSectionForQuote,
  updateSection,
} from "@/api/services/proposalDocument.api";
import type {
  CreateOrUpdateSectionForQuote,
  QuoteSectionCreatePayload,
  QuoteSectionUpdatePayload,
} from "@/types/api.requests.type";
import { useMutation } from "@tanstack/react-query";

function useSectionMutations() {
  const createSectionMutation = useMutation({
    mutationKey: ["create_section"],
    mutationFn: (data: QuoteSectionCreatePayload) => createSection(data),
  });

  const updateSectionMutation = useMutation({
    mutationKey: ["update_section"],
    mutationFn: (data: QuoteSectionUpdatePayload) => updateSection(data),
  });

  const deleteSectionMutation = useMutation({
    mutationKey: ["delete_section"],
    mutationFn: (id: string) => deleteSection(id),
  });

  const sectionMutationForQuote = useMutation({
    mutationKey: ["create_section_for_quote"],
    mutationFn: (data: CreateOrUpdateSectionForQuote) =>
      createOrUpdateSectionForQuote(data),
  });

  const sectionDeleteMutationForQuote = useMutation({
    mutationKey: ["delete_section_for_quote"],
    mutationFn: (payload: {
      quote_id: string | number;
      section_id: string | number;
    }) => deleteSectionForQuote(payload),
  });

  return {
    createSectionMutation,
    updateSectionMutation,
    deleteSectionMutation,
    sectionMutationForQuote,
    sectionDeleteMutationForQuote,
  };
}

export default useSectionMutations;
