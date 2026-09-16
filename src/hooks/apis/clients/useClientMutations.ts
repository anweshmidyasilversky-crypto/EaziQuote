import {
  createClient,
  deleteClient,
  updateClient,
} from "@/api/services/clients.api";
import type {
  ClientCreateApiPayload,
  UpdateClientApiPayload,
} from "@/types/api.requests.type";
import { useMutation } from "@tanstack/react-query";

function useClientMutations() {
  const clientCreatMutation = useMutation({
    mutationKey: ["client_create"],
    mutationFn: (data: ClientCreateApiPayload) => createClient(data),
  });

  const clientUpdateMutation = useMutation({
    mutationKey: ["client_update"],
    mutationFn: (data: UpdateClientApiPayload & { client_id: string }) => {
      const { client_id, ...patch } = data;
      return updateClient(client_id, patch);
    },
  });

  const clientDeleteMutation = useMutation({
    mutationKey: ["client_delete"],
    mutationFn: (client_id: string) => deleteClient(client_id),
  });

  return {
    clientCreatMutation,
    clientUpdateMutation,
    clientDeleteMutation,
  };
}

export default useClientMutations;
