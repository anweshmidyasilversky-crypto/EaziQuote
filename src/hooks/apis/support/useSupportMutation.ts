import { createSupportTicket } from "@/api/services/support.api";
import type { SupportTicketCreatePayload } from "@/types/api.requests.type";
import { useMutation } from "@tanstack/react-query";

function useSupportMutation() {
  const ticketCreateMutation = useMutation({
    mutationKey: ["create_ticket"],
    mutationFn: (payload: SupportTicketCreatePayload) =>
      createSupportTicket(payload),
  });
  return {
    ticketCreateMutation,
  };
}

export default useSupportMutation;
