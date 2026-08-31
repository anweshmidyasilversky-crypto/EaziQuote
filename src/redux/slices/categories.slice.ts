import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "../../types/category.types";

export const categoriesInitialState: Category[] = [
  { id: "cat-materials", name: "Materials" },
  { id: "cat-services", name: "Services" },
];

export const categoriesSlice = createSlice({
  initialState: categoriesInitialState,
  name: "categories",
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.push(action.payload);
    },

    removeCategory: (state, action: PayloadAction<{ id: string }>) => {
      const idx = state.findIndex((cat) => cat.id === action.payload.id);
      if (idx !== -1) {
        state.splice(idx, 1);
      }
    },
  },
});

export const { addCategory, removeCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
