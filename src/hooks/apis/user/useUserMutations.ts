import {
  changePassword,
  createCompany,
  updateCompany,
} from "@/api/services/auth.api";
import {
  addBusinessAddress,
  businessProfileSetup,
  profileSetup,
} from "@/api/services/user.api";
import type {
  ChangePasswordApiPayload,
  CompanyCreateApiPayload,
  CompanyUpdateApiPayload,
} from "@/types/api.requests.type";
import type { BusinessAddressPayload } from "@/types/businessAddress.payload.type";
import type { BusinessProfilePayload } from "@/types/businessProfile.payload.type";
import type { UserProfilePayload } from "@/types/userProfile.payload.type";
import { useMutation } from "@tanstack/react-query";
import type { Method } from "axios";

function useUserMutations() {
  const profileSetupMutation = useMutation({
    mutationKey: ["profile_create"],
    mutationFn: (data: UserProfilePayload & { _method?: Method }) => {
      const formData = new FormData();
      if (data._method) {
        formData.append("_method", "put");
      }
      formData.append("name", data.name);
      formData.append("phone", `+44${data.phoneNo}`);
      if (data.profilePic) {
        formData.append(
          "avatar",
          new Blob([data.profilePic], { type: data.profilePic.type }),
        );
      }
      return profileSetup(formData);
    },
  });

  const businessProfileMutation = useMutation({
    mutationKey: ["business_profile"],
    mutationFn: (data: BusinessProfilePayload) => {
      const formData = new FormData();
      formData.append("name", data.businessName);
      formData.append("phone", `+44${data.businessPhoneNo}`);
      formData.append("address", "dummyAddress");
      formData.append("vertical_market_id", data.trade);
      if (data.vatNumber) {
        formData.append("vat_number", data.vatNumber);
      }
      if (data.brandLogo) {
        formData.append(
          "logo",
          new Blob([data.brandLogo], { type: data.brandLogo.type }),
        );
      }
      return businessProfileSetup(formData);
    },
  });

  const comapnyAddressCreateMutation = useMutation({
    mutationKey: ["business_address_create"],
    mutationFn: (data: BusinessAddressPayload) => {
      const formData = new FormData();
      formData.append("_method", "put");
      formData.append("city", data.city);
      formData.append("country", data.country);
      formData.append("postcode", data.postCode);
      formData.append("address", data.street);
      return addBusinessAddress(formData);
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

  const passwordUpdateMutation = useMutation({
    mutationKey: ["update_password"],
    mutationFn: (payload: ChangePasswordApiPayload) => changePassword(payload),
  });

  return {
    profileSetupMutation,
    companyCreateMutation,
    companyUpdateMutation,
    passwordUpdateMutation,
    businessProfileMutation,
    comapnyAddressCreateMutation,
  };
}

export default useUserMutations;
