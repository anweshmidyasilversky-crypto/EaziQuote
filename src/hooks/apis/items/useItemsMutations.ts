import { createItem, deleteItem, updateItem } from "@/api/services/items.api";
import type { ItemCreateApiPayload } from "@/types/api.requests.type";
import type { ItemDetails } from "@/types/api.responses.type";
import { useMutation } from "@tanstack/react-query";

function useItemsMutations() {
  const createItemMutation = useMutation({
    mutationKey: ["items_create"],
    mutationFn: (payload: ItemCreateApiPayload) => createItem(payload),
  });

  const updateItemMutation = useMutation({
    mutationKey: ["items_update"],
    mutationFn: (payload: Partial<ItemDetails> & { id: string | number }) =>
      updateItem(payload),
  });

  const deleteItemMutation = useMutation({
    mutationKey: ["items_delete"],
    mutationFn: (itemId: string | number) => deleteItem(itemId),
  });
  return {
    createItemMutation,
    updateItemMutation,
    deleteItemMutation,
  };
}

export default useItemsMutations;
