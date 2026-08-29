import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Quote } from "../../types/quote.type";
import { getQuoteIdx } from "../../lib/utils";

export const quotesInitialState: Quote[] = [];

export const quotesSlice = createSlice({
  initialState: quotesInitialState,
  name: "quotes",
  reducers: {
    addQuote: (
      state,
      action: PayloadAction<Partial<Omit<Quote, "id">> & { id: string }>,
    ) => {
      action.payload.hasCompletedSummary = true;
      Object.assign(state, [...state, action.payload]);
    },

    updateQuote: (
      state,
      action: PayloadAction<Partial<Omit<Quote, "id">> & { id: string }>,
    ) => {
      const idx = getQuoteIdx(action.payload.id);
      if (idx !== -1) {
        Object.assign(state, [
          ...state.toSpliced(idx, 1),
          Object.assign(state[idx]),
        ]);
      }
    },

    removeQuote: (state, action: PayloadAction<{ id: string }>) => {
      const idx = getQuoteIdx(action.payload.id);
      if (idx !== -1) {
        Object.assign(state, state.toSpliced(idx, 1));
      }
    },
  },
});

export const { addQuote, updateQuote, removeQuote } = quotesSlice.actions;
export default quotesSlice.reducer;
