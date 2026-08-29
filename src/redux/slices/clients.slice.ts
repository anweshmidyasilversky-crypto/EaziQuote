import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Client } from "../../types/client.type";
import { getClientIdx } from "../../lib/utils";

export const clientsInitialState: Client[] = [];

export const ClientSlice = createSlice({
  name: "client",
  initialState: clientsInitialState,
  reducers: {
    addClient: (state, action: PayloadAction<Client>) => {
      Object.assign([...state, action.payload]);
    },

    updateClient: (
      state,
      action: PayloadAction<Partial<Omit<Client, "id">> & { id: string }>,
    ) => {
      const { id, ...patch } = action.payload;
      const clientIdx = getClientIdx(id);
      if (clientIdx !== -1) {
        Object.assign(state, [
          ...state.toSpliced(clientIdx, 1),
          Object.assign(state[clientIdx], patch),
        ]);
      }
    },

    removeClient: (state, action: PayloadAction<{ id: string }>) => {
      const clientIdx = getClientIdx(action.payload.id);
      if (clientIdx !== -1) {
        Object.assign(state, state.toSpliced(clientIdx, 1));
      }
    },
  },
});

export const { addClient, updateClient, removeClient } = ClientSlice.actions;
export default ClientSlice.reducer;
