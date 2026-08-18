import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UserType } from "../../types/user.type";

const initialState: UserType = {
  name: "",
  email: "",
  phoneNumber: "",
  businessName: "",
  businessPhoneNo: "",
  vatRegistered: false,
  trade: "",
  street: "",
  city: "",
  postCode: "",
  country: "",
  isUserProfileCreated: false,
  isBusinessProfileCreated: false,
  isBusinessAddressProvided: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<Partial<UserType>>) {
      Object.assign(state, action.payload);
    },

    removeUser(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { updateUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
