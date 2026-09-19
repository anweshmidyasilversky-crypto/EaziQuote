import {
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
} from "@/api/services/subCategories.api";
import type {
  SubCategoryCreateApiPayload,
  subCategoryUpdateApiPayload,
} from "@/types/api.requests.type";
import { useMutation } from "@tanstack/react-query";

function useSubCategoryMutations() {
  const createSubCategoryMutation = useMutation({
    mutationKey: ["subcategory_create"],
    mutationFn: (payload: SubCategoryCreateApiPayload) =>
      createSubCategory(payload),
  });

  const updateSubCategoryMutation = useMutation({
    mutationKey: ["subcategory_update"],
    mutationFn: (payload: subCategoryUpdateApiPayload) =>
      updateSubCategory(payload),
  });

  const deleteSubCategoryMutation = useMutation({
    mutationKey: ["subcategory_delete"],
    mutationFn: (subCatId: string | number) => deleteSubCategory(subCatId),
  });
  return {
    createSubCategoryMutation,
    updateSubCategoryMutation,
    deleteSubCategoryMutation,
  };
}

export default useSubCategoryMutations;
