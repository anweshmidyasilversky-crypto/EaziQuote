import { logout } from "@/api/services/auth.api";
import { deleteUser } from "@/api/services/user.api";
import { useMutation } from "@tanstack/react-query";

function useAuthMutation() {
  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
  });

  const userDeleteMutation = useMutation({
    mutationKey: ["delete_user"],
    mutationFn: deleteUser,
  });

  return {
    logoutMutation,
    userDeleteMutation,
  };
}

export default useAuthMutation;
