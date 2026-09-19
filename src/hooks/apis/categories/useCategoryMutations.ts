import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/api/services/categories.api";
import { useMutation } from "@tanstack/react-query";

function useCategoryMutations() {
  const createCategoryMutation = useMutation({
    mutationKey: ["category_create"],
    mutationFn: (name: string) => createCategory(name),
  });

  const updateCategoryMutation = useMutation({
    mutationKey: ["category_update"],
    mutationFn: (payload: { id: string | number; name: string }) =>
      updateCategory(payload),
  });

  const deleteCategoryMutation = useMutation({
    mutationKey: ["category_delete"],
    mutationFn: (id: number | string) => deleteCategory(id),
  });

  return {
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  };
}

export default useCategoryMutations;
