import { createCompany, updateCompany } from "@/api/services/auth.api";
import { profileSetup } from "@/api/services/user.api";
import type {
  CompanyCreateApiPayload,
  CompanyUpdateApiPayload,
} from "@/types/api.requests.type";
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
      if (data.profilePic) {
        formData.append(
          "avatar",
          new Blob([data.profilePic], { type: data.profilePic.type }),
        );
      }
      console.log(Object.fromEntries(formData));
      return profileSetup(formData);
    },
  });

  const companyCreateMutation = useMutation({
    mutationKey: ["company_create"],
    mutationFn: (data: CompanyCreateApiPayload) => createCompany(data),
  });

  const companyUpdateMutation = useMutation({
    mutationKey: ["company_update"],
    mutationFn: (data: CompanyUpdateApiPayload) => updateCompany(data),
  });

  return {
    profileSetupMutation,
    companyCreateMutation,
    companyUpdateMutation,
  };
}

export default useUserMutations;
