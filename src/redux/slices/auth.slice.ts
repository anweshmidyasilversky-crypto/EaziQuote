import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const authInitialState: {
  apiToken: string;
} = {
  apiToken: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      return { ...state, apiToken: action.payload };
    },
    releaseToken: () => {
      return { apiToken: "" };
    },
  },
});

export const { setToken, releaseToken } = authSlice.actions;
export default authSlice.reducer;
