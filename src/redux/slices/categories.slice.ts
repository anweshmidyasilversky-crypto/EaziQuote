import type { Category } from "@/types/api.responses.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const categoryInitialState: Category[] = [];

export const categoriesSlice = createSlice({
  initialState: categoryInitialState,
  name: "categories",
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.push(action.payload);
    },

    removeCategory: (state, action: PayloadAction<{ id: number }>) => {
      const idx = state.findIndex((cat) => cat.id === action.payload.id);
      if (idx !== -1) {
        state.splice(idx, 1);
      }
    },
  },
});

export const { addCategory, removeCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
