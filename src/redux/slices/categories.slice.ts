import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "../../types/category.types";
import { getCategoryIdx } from "../../lib/utils";

export const categoriesInitialState: Category[] = [];

export const categoriesSlice = createSlice({
  initialState: categoriesInitialState,
  name: "categories",
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      Object.assign(state, [...state, action.payload]);
    },

    removeCategory: (state, action: PayloadAction<{ id: string }>) => {
      const idx = getCategoryIdx(action.payload.id);
      if (idx !== -1) {
        Object.assign(state, state.toSpliced(idx, 1));
      }
    },
  },
});

export const { addCategory, removeCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
