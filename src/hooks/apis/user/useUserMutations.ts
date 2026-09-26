import { profileSetup } from "@/api/services/user.api";
import type { UserProfilePayload } from "@/types/userProfile.payload.type";
import { useMutation } from "@tanstack/react-query";

function useUserMutations() {
  const profileSetupMutation = useMutation({
    mutationKey: ["profile_create"],
    mutationFn: (data: UserProfilePayload) => {
      const formData = new FormData();
      formData.append("_method", "put");
      formData.append("name", data.name);
      formData.append("phone", `+44${data.phoneNo}`);
      formData.append(
        "avatar",
        data.profilePic
          ? new Blob([data.profilePic], { type: data.profilePic.type })
          : new Blob(),
      );
      console.log(Object.fromEntries(formData));
      return profileSetup(formData);
    },
  });

  return {
    profileSetupMutation,
  };
}

export default useUserMutations;
