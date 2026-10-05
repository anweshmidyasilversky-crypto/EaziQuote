import { onboardUser } from "@/api/services/stripe.api";
import { useMutation } from "@tanstack/react-query";

function useStripeMutation() {
  const userOnboardMutation = useMutation({
    mutationFn: onboardUser,
  });

  return {
    userOnboardMutation,
  };
}

export default useStripeMutation;
