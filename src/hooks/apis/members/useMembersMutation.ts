import { createTeamMember, updateTeamMember } from "@/api/services/members.api";
import type {
  TeamMemberCreateApiPayload,
  TeamMemberUpdateApiPayload,
} from "@/types/api.requests.type";
import { useMutation } from "@tanstack/react-query";

function useMembersMutation() {
  const memberCreateMutation = useMutation({
    mutationKey: ["member_create"],
    mutationFn: (payload: TeamMemberCreateApiPayload) =>
      createTeamMember(payload),
  });

  const memberUpdateMutation = useMutation({
    mutationKey: ["member_update"],
    mutationFn: (payload: TeamMemberUpdateApiPayload) =>
      updateTeamMember(payload),
  });

  return {
    memberCreateMutation,
    memberUpdateMutation,
  };
}

export default useMembersMutation;
