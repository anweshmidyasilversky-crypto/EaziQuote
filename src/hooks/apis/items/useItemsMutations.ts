import {
  createItem,
  deleteItem,
  getSampleTemplate,
  itemImport,
  updateItem,
} from "@/api/services/items.api";
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

  const itemsImportMutation = useMutation({
    mutationKey: ["items_upload"],
    mutationFn: (file: File) => itemImport(file),
  });

  const templateDownloaMutation = useMutation({
    mutationKey: ["items_sample_download"],
    mutationFn: getSampleTemplate,
  });

  return {
    createItemMutation,
    updateItemMutation,
    deleteItemMutation,
    itemsImportMutation,
    templateDownloaMutation,
  };
}

export default useItemsMutations;
