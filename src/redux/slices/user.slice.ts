import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UserType } from "../../types/user.type";

const initialState: UserType = {
  name: "",
  email: "",
  phoneNumber: "",
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
