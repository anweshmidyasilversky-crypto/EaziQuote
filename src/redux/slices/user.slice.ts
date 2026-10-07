import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UserType } from "../../types/user.type";
import type {
  BillingDetailsResponse,
  Company,
  User,
} from "@/types/api.responses.type";
import { StripAccountStatus } from "@/types/api.responses.type";

export const initialState: User = {
  id: 0,
  name: "",
  email: "",
  phone: "",
  role: "",
  is_email_verified: false,
  is_active: false,
  avatar: null,
  access_token: "",
  company: {
    id: 0,
    name: "",
    email: "",
    phone_number: "",
    logo: null,
    brand_color: "",
    vat_number: null,
    currency: "",
    is_company_name_show: false,
    address: {
      id: 0,
      address: "",
      city: "",
      state: null,
      country: "",
      latitude: null,
      longitude: null,
      postcode: "",
    },
    billing_details: {
      id: 0,
      name: "",
      email: "",
      phone: "",
      bank_name: "",
      sort_code: "",
      account_number: "",
      created_at: null,
      updated_at: null,
    },
    created_at: "",
    updated_at: "",
  },
  is_profile_setup: false,
  is_company_profile_setup: false,
  is_company_address_setup: false,
  created_at: "",
  updated_at: "",
  is_subscription_active: false,
  subscription_ended_at: null,
  is_trial_period: false,
  subscription_amount: null,
  hasBankAccountDetailAdded: false,
  hasSignatureAdded: false,
  is_team_member: false,
  default_payment_method: "",
  stripe_account_status: StripAccountStatus.inactive,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    updateUser(
      state,
      action: PayloadAction<Partial<UserType> & Partial<User>>,
    ) {
      console.log(`PAyload: `, action.payload);
      Object.assign(state, action.payload);
    },

    updateCompany(state, action: PayloadAction<Company>) {
      Object.assign(state.company, action.payload);
    },

    updateBillingDetails(
      state,
      action: PayloadAction<BillingDetailsResponse & Partial<User>>,
    ) {
      const newState = {
        ...state,
        hasBankAccountDetailAdded: true,
        company: Object.assign(state.company, {
          billing_details: action.payload,
        } as Partial<Company>),
      } as User;

      console.log(newState);

      Object.assign(state, newState);
    },

    removeUser(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  updateUser,
  removeUser,
  updateCompany,
  updateBillingDetails: updateBillingDetailsRedux,
} = userSlice.actions;
export default userSlice.reducer;
