import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Item } from "../../types/item.type";

// ── Seeded catalog items (mapped from dummyData itemData) ────────────────────
// catId / subCatId reference the IDs seeded in categories / subCategories slices.
export const itemsInitialState: Item[] = [
  // ── Materials / Tools ──────────────────────────────────────────────────────
  {
    id: "item-floor-tiles",
    catId: "cat-materials",
    subCatId: "sub-tools",
    name: "Floor Tiles",
    unit: "sq.ft",
    pricePerUnit: 12,
    unitPrice: 6,
  },
  // ── Materials / Ceiling ───────────────────────────────────────────────────
  {
    id: "item-glass-partition",
    catId: "cat-materials",
    subCatId: "sub-ceiling",
    name: "Glass Partition",
    unit: "panels",
    pricePerUnit: 150,
    unitPrice: 75,
  },
  {
    id: "item-false-ceiling",
    catId: "cat-materials",
    subCatId: "sub-ceiling",
    name: "False Ceiling",
    unit: "sq.ft",
    pricePerUnit: 18,
    unitPrice: 10,
  },
  // ── Materials / Doors ─────────────────────────────────────────────────────
  {
    id: "item-wooden-doors",
    catId: "cat-materials",
    subCatId: "sub-doors",
    name: "Wooden Doors",
    unit: "units",
    pricePerUnit: 280,
    unitPrice: 180,
  },
  {
    id: "item-interior-doors",
    catId: "cat-materials",
    subCatId: "sub-doors",
    name: "Interior Doors",
    unit: "units",
    pricePerUnit: 350,
    unitPrice: 220,
  },
  {
    id: "item-glass-door",
    catId: "cat-materials",
    subCatId: "sub-doors",
    name: "Glass Door",
    unit: "units",
    pricePerUnit: 420,
    unitPrice: 280,
  },
  // ── Materials / Electrical ────────────────────────────────────────────────
  {
    id: "item-led-lighting",
    catId: "cat-materials",
    subCatId: "sub-electrical",
    name: "LED Lighting",
    unit: "units",
    pricePerUnit: 45,
    unitPrice: 25,
  },
  {
    id: "item-power-sockets",
    catId: "cat-materials",
    subCatId: "sub-electrical",
    name: "Power Sockets",
    unit: "units",
    pricePerUnit: 18,
    unitPrice: 10,
  },
  {
    id: "item-ceiling-fans",
    catId: "cat-materials",
    subCatId: "sub-electrical",
    name: "Ceiling Fans",
    unit: "units",
    pricePerUnit: 95,
    unitPrice: 60,
  },
  // ── Materials / Wall Finishing ────────────────────────────────────────────
  {
    id: "item-wall-panels",
    catId: "cat-materials",
    subCatId: "sub-wall-finishing",
    name: "Wall Panels",
    unit: "sq.ft",
    pricePerUnit: 35,
    unitPrice: 20,
  },
  {
    id: "item-ceramic-wall-tiles",
    catId: "cat-materials",
    subCatId: "sub-wall-finishing",
    name: "Ceramic Wall Tiles",
    unit: "sq.ft",
    pricePerUnit: 14,
    unitPrice: 8,
  },
  {
    id: "item-wood-paneling",
    catId: "cat-materials",
    subCatId: "sub-wall-finishing",
    name: "Wood Paneling",
    unit: "sq.ft",
    pricePerUnit: 38,
    unitPrice: 24,
  },
  // ── Materials / Windows ───────────────────────────────────────────────────
  {
    id: "item-aluminum-windows",
    catId: "cat-materials",
    subCatId: "sub-windows",
    name: "Aluminum Windows",
    unit: "units",
    pricePerUnit: 220,
    unitPrice: 140,
  },
  // ── Materials / Flooring ──────────────────────────────────────────────────
  {
    id: "item-marble-flooring",
    catId: "cat-materials",
    subCatId: "sub-flooring",
    name: "Marble Flooring",
    unit: "sq.ft",
    pricePerUnit: 45,
    unitPrice: 28,
  },
  {
    id: "item-wooden-flooring",
    catId: "cat-materials",
    subCatId: "sub-flooring",
    name: "Wooden Flooring",
    unit: "sq.ft",
    pricePerUnit: 32,
    unitPrice: 20,
  },
  // ── Materials / Plumbing ──────────────────────────────────────────────────
  {
    id: "item-bathroom-fixtures",
    catId: "cat-materials",
    subCatId: "sub-plumbing",
    name: "Bathroom Fixtures",
    unit: "sets",
    pricePerUnit: 180,
    unitPrice: 110,
  },
  {
    id: "item-copper-pipes",
    catId: "cat-materials",
    subCatId: "sub-plumbing",
    name: "Copper Pipes",
    unit: "metres",
    pricePerUnit: 22,
    unitPrice: 14,
  },
  // ── Materials / Partitions ────────────────────────────────────────────────
  {
    id: "item-office-partition",
    catId: "cat-materials",
    subCatId: "sub-partitions",
    name: "Office Partition",
    unit: "panels",
    pricePerUnit: 175,
    unitPrice: 100,
  },
  // ── Materials / Countertops ───────────────────────────────────────────────
  {
    id: "item-granite-countertop",
    catId: "cat-materials",
    subCatId: "sub-countertops",
    name: "Granite Countertop",
    unit: "sq.ft",
    pricePerUnit: 55,
    unitPrice: 35,
  },
  // ── Materials / Cabinetry ─────────────────────────────────────────────────
  {
    id: "item-kitchen-cabinets",
    catId: "cat-materials",
    subCatId: "sub-cabinetry",
    name: "Kitchen Cabinets",
    unit: "units",
    pricePerUnit: 320,
    unitPrice: 210,
  },
  // ── Materials / Furniture ─────────────────────────────────────────────────
  {
    id: "item-reception-counter",
    catId: "cat-materials",
    subCatId: "sub-furniture",
    name: "Reception Counter",
    unit: "units",
    pricePerUnit: 850,
    unitPrice: 550,
  },
  {
    id: "item-office-chairs",
    catId: "cat-materials",
    subCatId: "sub-furniture",
    name: "Office Chairs",
    unit: "units",
    pricePerUnit: 145,
    unitPrice: 90,
  },
  // ── Services / Painting ───────────────────────────────────────────────────
  {
    id: "item-painting",
    catId: "cat-services",
    subCatId: "svc-painting",
    name: "Painting",
    unit: "hours",
    pricePerUnit: 60,
    unitPrice: 30,
  },
  {
    id: "item-wall-painting",
    catId: "cat-services",
    subCatId: "svc-painting",
    name: "Wall Painting",
    unit: "hours",
    pricePerUnit: 55,
    unitPrice: 28,
  },
  // ── Services / Carpeting ──────────────────────────────────────────────────
  {
    id: "item-carpet-replacement",
    catId: "cat-services",
    subCatId: "svc-carpeting",
    name: "Carpet Replacement",
    unit: "sq.ft",
    pricePerUnit: 12,
    unitPrice: 6,
  },
  // ── Services / Flooring ───────────────────────────────────────────────────
  {
    id: "item-floor-renovation",
    catId: "cat-services",
    subCatId: "svc-flooring",
    name: "Floor Renovation",
    unit: "hours",
    pricePerUnit: 60,
    unitPrice: 30,
  },
  {
    id: "item-floor-polishing",
    catId: "cat-services",
    subCatId: "svc-flooring",
    name: "Floor Polishing",
    unit: "sq.ft",
    pricePerUnit: 15,
    unitPrice: 8,
  },
  {
    id: "item-tile-grouting",
    catId: "cat-services",
    subCatId: "svc-flooring",
    name: "Tile Grouting",
    unit: "sq.ft",
    pricePerUnit: 10,
    unitPrice: 5,
  },
  // ── Services / Plumbing ───────────────────────────────────────────────────
  {
    id: "item-plumbing-installation",
    catId: "cat-services",
    subCatId: "svc-plumbing",
    name: "Plumbing Installation",
    unit: "hours",
    pricePerUnit: 75,
    unitPrice: 40,
  },
  {
    id: "item-plumbing-repair",
    catId: "cat-services",
    subCatId: "svc-plumbing",
    name: "Plumbing Repair",
    unit: "hours",
    pricePerUnit: 80,
    unitPrice: 45,
  },
  {
    id: "item-drainage-installation",
    catId: "cat-services",
    subCatId: "svc-plumbing",
    name: "Drainage Installation",
    unit: "hours",
    pricePerUnit: 72,
    unitPrice: 38,
  },
  // ── Services / Electrical ─────────────────────────────────────────────────
  {
    id: "item-electrical-wiring",
    catId: "cat-services",
    subCatId: "svc-electrical",
    name: "Electrical Wiring",
    unit: "metres",
    pricePerUnit: 18,
    unitPrice: 10,
  },
  {
    id: "item-electrical-maintenance",
    catId: "cat-services",
    subCatId: "svc-electrical",
    name: "Electrical Maintenance",
    unit: "hours",
    pricePerUnit: 65,
    unitPrice: 35,
  },
  {
    id: "item-lighting-installation",
    catId: "cat-services",
    subCatId: "svc-electrical",
    name: "Lighting Installation",
    unit: "hours",
    pricePerUnit: 58,
    unitPrice: 30,
  },
  // ── Services / Wall Finishing ─────────────────────────────────────────────
  {
    id: "item-wallpaper-installation",
    catId: "cat-services",
    subCatId: "svc-wall-finishing",
    name: "Wallpaper Installation",
    unit: "sq.ft",
    pricePerUnit: 16,
    unitPrice: 9,
  },
  // ── Services / HVAC ───────────────────────────────────────────────────────
  {
    id: "item-ac-installation",
    catId: "cat-services",
    subCatId: "svc-hvac",
    name: "AC Installation",
    unit: "units",
    pricePerUnit: 180,
    unitPrice: 100,
  },
  {
    id: "item-insulation-work",
    catId: "cat-services",
    subCatId: "svc-hvac",
    name: "Insulation Work",
    unit: "sq.ft",
    pricePerUnit: 14,
    unitPrice: 8,
  },
  // ── Services / Carpentry ──────────────────────────────────────────────────
  {
    id: "item-carpentry-work",
    catId: "cat-services",
    subCatId: "svc-carpentry",
    name: "Carpentry Work",
    unit: "hours",
    pricePerUnit: 70,
    unitPrice: 40,
  },
];

export const itemsSlice = createSlice({
  initialState: itemsInitialState,
  name: "items",
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.push(action.payload);
    },

    updateItem: (state, action: PayloadAction<Item>) => {
      const { id, ...patch } = action.payload;
      const idx = state.findIndex((item) => item.id === id);
      Object.assign([
        ...state.toSpliced(idx, 1),
        Object.assign(state[idx], patch),
      ]);
    },

    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      const idx = state.findIndex((item) => item.id === action.payload.id);
      if (idx !== -1) {
        state.splice(idx, 1);
      }
    },
  },
});

export const { addItem, removeItem, updateItem } = itemsSlice.actions;
export default itemsSlice.reducer;
