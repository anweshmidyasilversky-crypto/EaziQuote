import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SubCategory } from "../../types/subCategory.type";
import { getSubCategoryIdx } from "../../lib/utils";

export const subCategoriesInitialState: SubCategory[] = [];

export const subCategoriesSlice = createSlice({
  initialState: subCategoriesInitialState,
  name: "subCategories",
  reducers: {
    addSubCategory: (state, action: PayloadAction<SubCategory>) => {
      Object.assign([...state, action.payload]);
    },

    removeSubCategory: (state, action: PayloadAction<{ id: string }>) => {
      const idx = getSubCategoryIdx(action.payload.id);
      if (idx !== -1) {
        Object.assign(state.toSpliced(idx, 1));
      }
    },
  },
});

export const { addSubCategory, removeSubCategory } = subCategoriesSlice.actions;
export default subCategoriesSlice.reducer;
