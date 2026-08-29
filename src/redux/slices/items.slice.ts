import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Item } from "../../types/item.type";
import { getItemIdx } from "../../lib/utils";

export const itemsInitialState: Item[] = [];

export const itemsSlice = createSlice({
  initialState: itemsInitialState,
  name: "items",
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      Object.assign(state, [...state, action.payload]);
    },
    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      const idx = getItemIdx(action.payload.id);
      if (idx !== -1) {
        state = state.toSpliced(idx, 1);
      }
    },
  },
});

export const { addItem, removeItem } = itemsSlice.actions;
export default itemsSlice.reducer;
