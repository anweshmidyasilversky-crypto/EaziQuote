import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SubCategory } from "../../types/subCategory.type";

// ── Materials subcategories ──────────────────────────────────────────────────
const materialsSubs: SubCategory[] = [
  { id: "sub-tools", catId: "cat-materials", name: "Tools" },
  { id: "sub-ceiling", catId: "cat-materials", name: "Ceiling" },
  { id: "sub-doors", catId: "cat-materials", name: "Doors" },
  { id: "sub-electrical", catId: "cat-materials", name: "Electrical" },
  { id: "sub-wall-finishing", catId: "cat-materials", name: "Wall Finishing" },
  { id: "sub-windows", catId: "cat-materials", name: "Windows" },
  { id: "sub-flooring", catId: "cat-materials", name: "Flooring" },
  { id: "sub-plumbing", catId: "cat-materials", name: "Plumbing" },
  { id: "sub-partitions", catId: "cat-materials", name: "Partitions" },
  { id: "sub-countertops", catId: "cat-materials", name: "Countertops" },
  { id: "sub-cabinetry", catId: "cat-materials", name: "Cabinetry" },
  { id: "sub-furniture", catId: "cat-materials", name: "Furniture" },
];

// ── Services subcategories ───────────────────────────────────────────────────
const servicesSubs: SubCategory[] = [
  { id: "svc-painting", catId: "cat-services", name: "Painting" },
  { id: "svc-carpeting", catId: "cat-services", name: "Carpeting" },
  { id: "svc-flooring", catId: "cat-services", name: "Flooring" },
  { id: "svc-plumbing", catId: "cat-services", name: "Plumbing" },
  { id: "svc-electrical", catId: "cat-services", name: "Electrical" },
  { id: "svc-wall-finishing", catId: "cat-services", name: "Wall Finishing" },
  { id: "svc-hvac", catId: "cat-services", name: "HVAC" },
  { id: "svc-carpentry", catId: "cat-services", name: "Carpentry" },
];

export const subCategoriesInitialState: SubCategory[] = [
  ...materialsSubs,
  ...servicesSubs,
];

export const subCategoriesSlice = createSlice({
  initialState: subCategoriesInitialState,
  name: "subCategories",
  reducers: {
    addSubCategory: (state, action: PayloadAction<SubCategory>) => {
      state.push(action.payload);
    },

    removeSubCategory: (state, action: PayloadAction<{ id: string }>) => {
      const idx = state.findIndex((sub) => sub.id === action.payload.id);
      if (idx !== -1) {
        state.splice(idx, 1);
      }
    },
  },
});

export const { addSubCategory, removeSubCategory } =
  subCategoriesSlice.actions;
export default subCategoriesSlice.reducer;
