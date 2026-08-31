import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Client } from "../../types/client.type";

// ── Seeded clients (mapped from dummyData mockClientData — 5 unique entries) ─
export const clientsInitialState: Client[] = [
  {
    id: "client-1",
    name: "Emma Smith",
    companyName: "Smith & Co Builders",
    phone: "(+44) 456-789-2002",
    email: "es@gmail.com",
    street: "Ambawadi Road",
    city: "Ahmedabad",
    postCode: "380015",
    country: "India",
    createdAt: "2026-08-15T10:30:00Z",
  },
  {
    id: "client-2",
    name: "Daniel Murphy",
    companyName: "Murphy Industries",
    phone: "(+44) 456-789-2002",
    email: "dm@gmail.com",
    street: "Connaught Place",
    city: "New Delhi",
    postCode: "110001",
    country: "India",
    createdAt: "2026-08-14T14:20:00Z",
  },
  {
    id: "client-3",
    name: "Olivia Bennett",
    companyName: "Bennett Pvt. Ltd.",
    phone: "(+44) 456-789-2002",
    email: "ob@gmail.com",
    street: "Colaba Causeway",
    city: "Mumbai",
    postCode: "400001",
    country: "India",
    createdAt: "2026-08-12T09:15:00Z",
  },
  {
    id: "client-4",
    name: "James Carter",
    companyName: "Carter Groups",
    phone: "(+44) 456-789-2002",
    email: "jc@gmail.com",
    street: "Park Street",
    city: "Kolkata",
    postCode: "700001",
    country: "India",
    createdAt: "2026-08-10T11:45:00Z",
  },
  {
    id: "client-5",
    name: "Sophia Turner",
    companyName: "Turner & Turner",
    phone: "(+44) 456-789-2002",
    email: "st@gmail.com",
    street: "Anna Salai",
    city: "Chennai",
    postCode: "600001",
    country: "India",
    createdAt: "2026-08-08T16:00:00Z",
  },
];

export const ClientSlice = createSlice({
  name: "client",
  initialState: clientsInitialState,
  reducers: {
    addClient: (state, action: PayloadAction<Client>) => {
      state.push(action.payload);
    },

    updateClient: (
      state,
      action: PayloadAction<Partial<Omit<Client, "id">> & { id: string }>,
    ) => {
      const { id, ...patch } = action.payload;
      const idx = state.findIndex((c) => c.id === id);
      if (idx !== -1) {
        Object.assign(state[idx], patch);
      }
    },

    removeClient: (state, action: PayloadAction<{ id: string }>) => {
      const idx = state.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) {
        state.splice(idx, 1);
      }
    },
  },
});

export const { addClient, updateClient, removeClient } = ClientSlice.actions;
export default ClientSlice.reducer;
