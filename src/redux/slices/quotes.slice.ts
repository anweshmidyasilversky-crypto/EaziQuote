import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Quote } from "../../types/quote.type";
import type { QuoteLineItem } from "../../types/quoteLineItem.type";
import type { QuoteSection } from "../../types/quoteSection.type";

// ── Helper: compute total for a line item ────────────────────────────────────
const lineTotal = (pricePerUnit: number, quantity: number) =>
  pricePerUnit * quantity;

// ── Seeded quote line items per quote ────────────────────────────────────────
// Rule: total = pricePerUnit × quantity (enforced here and in all update paths)

/** QT-2025-101 · Office Interior Design  (amount ≈ £4,806) */
const items_101: QuoteLineItem[] = [
  {
    id: "qi-101-1",
    itemId: "item-floor-tiles",
    catId: "cat-materials",
    subCatId: "sub-tools",
    name: "Floor Tiles",
    unit: "sq.ft",
    pricePerUnit: 12,
    unitCost: 6,
    quantity: 100,
    total: lineTotal(12, 100), // 1200
  },
  {
    id: "qi-101-2",
    itemId: "item-wall-panels",
    catId: "cat-materials",
    subCatId: "sub-wall-finishing",
    name: "Wall Panels",
    unit: "sq.ft",
    pricePerUnit: 35,
    unitCost: 20,
    quantity: 50,
    total: lineTotal(35, 50), // 1750
  },
  {
    id: "qi-101-3",
    itemId: "item-led-lighting",
    catId: "cat-materials",
    subCatId: "sub-electrical",
    name: "LED Lighting",
    unit: "units",
    pricePerUnit: 45,
    unitCost: 25,
    quantity: 12,
    total: lineTotal(45, 12), // 540
  },
  {
    id: "qi-101-4",
    itemId: "item-wall-painting",
    catId: "cat-services",
    subCatId: "svc-painting",
    name: "Wall Painting",
    unit: "hours",
    pricePerUnit: 55,
    unitCost: 28,
    quantity: 20,
    total: lineTotal(55, 20), // 1100
  },
  {
    id: "qi-101-5",
    itemId: "item-power-sockets",
    catId: "cat-materials",
    subCatId: "sub-electrical",
    name: "Power Sockets",
    unit: "units",
    pricePerUnit: 18,
    unitCost: 10,
    quantity: 12,
    total: lineTotal(18, 12), // 216
  },
  // Total: 1200 + 1750 + 540 + 1100 + 216 = 4,806
];

/** QT-2025-102 · Residential Plumbing Works  (amount ≈ £6,180) */
const items_102: QuoteLineItem[] = [
  {
    id: "qi-102-1",
    itemId: "item-copper-pipes",
    catId: "cat-materials",
    subCatId: "sub-plumbing",
    name: "Copper Pipes",
    unit: "metres",
    pricePerUnit: 22,
    unitCost: 14,
    quantity: 120,
    total: lineTotal(22, 120), // 2640
  },
  {
    id: "qi-102-2",
    itemId: "item-bathroom-fixtures",
    catId: "cat-materials",
    subCatId: "sub-plumbing",
    name: "Bathroom Fixtures",
    unit: "sets",
    pricePerUnit: 180,
    unitCost: 110,
    quantity: 5,
    total: lineTotal(180, 5), // 900
  },
  {
    id: "qi-102-3",
    itemId: "item-plumbing-installation",
    catId: "cat-services",
    subCatId: "svc-plumbing",
    name: "Plumbing Installation",
    unit: "hours",
    pricePerUnit: 75,
    unitCost: 40,
    quantity: 16,
    total: lineTotal(75, 16), // 1200
  },
  {
    id: "qi-102-4",
    itemId: "item-drainage-installation",
    catId: "cat-services",
    subCatId: "svc-plumbing",
    name: "Drainage Installation",
    unit: "hours",
    pricePerUnit: 72,
    unitCost: 38,
    quantity: 20,
    total: lineTotal(72, 20), // 1440
  },
  // Total: 2640 + 900 + 1200 + 1440 = 6,180
];

/** QT-2025-103 · Retail Store Interior Fit-Out  (amount ≈ £3,470) */
const items_103: QuoteLineItem[] = [
  {
    id: "qi-103-1",
    itemId: "item-ceramic-wall-tiles",
    catId: "cat-materials",
    subCatId: "sub-wall-finishing",
    name: "Ceramic Wall Tiles",
    unit: "sq.ft",
    pricePerUnit: 14,
    unitCost: 8,
    quantity: 100,
    total: lineTotal(14, 100), // 1400
  },
  {
    id: "qi-103-2",
    itemId: "item-glass-partition",
    catId: "cat-materials",
    subCatId: "sub-ceiling",
    name: "Glass Partition",
    unit: "panels",
    pricePerUnit: 150,
    unitCost: 75,
    quantity: 4,
    total: lineTotal(150, 4), // 600
  },
  {
    id: "qi-103-3",
    itemId: "item-lighting-installation",
    catId: "cat-services",
    subCatId: "svc-electrical",
    name: "Lighting Installation",
    unit: "hours",
    pricePerUnit: 58,
    unitCost: 30,
    quantity: 15,
    total: lineTotal(58, 15), // 870
  },
  {
    id: "qi-103-4",
    itemId: "item-tile-grouting",
    catId: "cat-services",
    subCatId: "svc-flooring",
    name: "Tile Grouting",
    unit: "sq.ft",
    pricePerUnit: 10,
    unitCost: 5,
    quantity: 60,
    total: lineTotal(10, 60), // 600
  },
  // Total: 1400 + 600 + 870 + 600 = 3,470
];

/** QT-2025-104 · Electrical Wiring & Lighting  (amount ≈ £5,200) */
const items_104: QuoteLineItem[] = [
  {
    id: "qi-104-1",
    itemId: "item-electrical-wiring",
    catId: "cat-services",
    subCatId: "svc-electrical",
    name: "Electrical Wiring",
    unit: "metres",
    pricePerUnit: 18,
    unitCost: 10,
    quantity: 180,
    total: lineTotal(18, 180), // 3240
  },
  {
    id: "qi-104-2",
    itemId: "item-led-lighting",
    catId: "cat-materials",
    subCatId: "sub-electrical",
    name: "LED Lighting",
    unit: "units",
    pricePerUnit: 45,
    unitCost: 25,
    quantity: 20,
    total: lineTotal(45, 20), // 900
  },
  {
    id: "qi-104-3",
    itemId: "item-power-sockets",
    catId: "cat-materials",
    subCatId: "sub-electrical",
    name: "Power Sockets",
    unit: "units",
    pricePerUnit: 18,
    unitCost: 10,
    quantity: 30,
    total: lineTotal(18, 30), // 540
  },
  {
    id: "qi-104-4",
    itemId: "item-electrical-maintenance",
    catId: "cat-services",
    subCatId: "svc-electrical",
    name: "Electrical Maintenance",
    unit: "hours",
    pricePerUnit: 65,
    unitCost: 35,
    quantity: 8,
    total: lineTotal(65, 8), // 520
  },
  // Total: 3240 + 900 + 540 + 520 = 5,200
];

/** QT-2025-105 · Painting & Finishing Services  (amount ≈ £2,925) */
const items_105: QuoteLineItem[] = [
  {
    id: "qi-105-1",
    itemId: "item-wall-painting",
    catId: "cat-services",
    subCatId: "svc-painting",
    name: "Wall Painting",
    unit: "hours",
    pricePerUnit: 55,
    unitCost: 28,
    quantity: 25,
    total: lineTotal(55, 25), // 1375
  },
  {
    id: "qi-105-2",
    itemId: "item-floor-polishing",
    catId: "cat-services",
    subCatId: "svc-flooring",
    name: "Floor Polishing",
    unit: "sq.ft",
    pricePerUnit: 15,
    unitCost: 8,
    quantity: 50,
    total: lineTotal(15, 50), // 750
  },
  {
    id: "qi-105-3",
    itemId: "item-wallpaper-installation",
    catId: "cat-services",
    subCatId: "svc-wall-finishing",
    name: "Wallpaper Installation",
    unit: "sq.ft",
    pricePerUnit: 16,
    unitCost: 9,
    quantity: 50,
    total: lineTotal(16, 50), // 800
  },
  // Total: 1375 + 750 + 800 = 2,925
];

// ── Seeded quote sections ────────────────────────────────────────────────────
const sections_101: QuoteSection[] = [
  {
    order: "1",
    section: "Introduction & Overview",
    description:
      "This quote covers the comprehensive renovation of the office space, including material supply, floor tiling, LED lighting installation, and acoustic partition adjustments.",
  },
  {
    order: "2",
    section: "Scope of Work & Materials",
    description:
      "Alpha Renovates Pvt. Ltd. provides complete interior refurbishment, premium quality floor tiling, ambient lighting, and bespoke partition fittings.",
  },
  {
    order: "3",
    section: "Detailed Terms & Conditions",
    description:
      "This quote is valid for 30 days from the issue date. Payment terms: 14 days from invoice date. 50% deposit required upon project commencement.",
  },
];

const sections_102: QuoteSection[] = [
  {
    order: "1",
    section: "Project Scope",
    description:
      "Full residential plumbing overhaul including copper pipework, sanitary ware installation, and complete drainage testing.",
  },
  {
    order: "2",
    section: "Materials & Guarantees",
    description:
      "All copper pipes and brass fittings carry a 5-year manufacturer guarantee. Installation tested to WRAS standards.",
  },
  {
    order: "3",
    section: "Terms & Handover",
    description:
      "14 days payment term following project sign-off and pressure testing certificate delivery.",
  },
];

const sections_103: QuoteSection[] = [
  {
    order: "1",
    section: "Store Front & Tiling",
    description:
      "Ceramic wall and floor tiling across commercial retail space, glass partition installation, and low-voltage lighting.",
  },
  {
    order: "2",
    section: "Safety & Compliance",
    description:
      "All materials and structural partitions comply with commercial building regulations and fire safety codes.",
  },
  {
    order: "3",
    section: "Warranty & Aftercare",
    description:
      "12 months comprehensive aftercare service included for all installed fixtures and fittings.",
  },
];

const sections_104: QuoteSection[] = [
  {
    order: "1",
    section: "Electrical Rewiring",
    description:
      "Complete 180m conduit rewiring, high-efficiency commercial LED lighting arrays, and surge-protected power socket distribution.",
  },
  {
    order: "2",
    section: "Testing & Certification",
    description:
      "Includes NICEIC electrical installation condition report and safety certification upon completion.",
  },
  {
    order: "3",
    section: "Payment Schedule",
    description:
      "50% deposit required upon project start, remaining balance due within 7 days of final testing certification.",
  },
];

const sections_105: QuoteSection[] = [
  {
    order: "1",
    section: "Surface Preparation & Painting",
    description:
      "Two coats of premium matte finish on all internal walls, hardwood floor machine polishing, and designer wallpaper installation.",
  },
  {
    order: "2",
    section: "Cleanup & Disposal",
    description:
      "Daily site cleanup and eco-friendly disposal of all old floor coverings and surface residues.",
  },
  {
    order: "3",
    section: "Payment Terms",
    description:
      "Balance due upon final client walk-through and completion sign-off.",
  },
];

// ── Seeded quotes ─────────────────────────────────────────────────────────────
export const quotesInitialState: Quote[] = [
  {
    id: "QT-2025-101",
    title: "Office Interior Design",
    referenceNumber: "QT-2025-101",
    quoteDate: "2025-09-12",
    expiryDate: "2025-10-12",
    hidePhoneNumber: false,
    clientId: "client-1",
    jobDescription:
      "This quote covers the renovation of Acme Corp's office space, including material supply, floor tiling, and partition adjustments. It also includes labor for installation and finishing work.",
    notes:
      "The client, Brightline Solutions, is looking for a complete redesign of their 3rd-floor workspace to support a hybrid work model. They emphasized modular furniture, soundproof meeting pods, and eco-friendly materials.",
    attachments: [],
    hasCompletedSummary: true,
    status: "Sent",
    paymentMethod: "Cash",
    isItemsSelected: true,
    items: items_101,
    sections: sections_101,
  },
  {
    id: "QT-2025-102",
    title: "Residential Plumbing Works",
    referenceNumber: "QT-2025-102",
    quoteDate: "2025-09-15",
    expiryDate: "2025-10-15",
    hidePhoneNumber: false,
    clientId: "client-2",
    jobDescription:
      "Full plumbing overhaul for a residential property including pipework, sanitary fittings, pressure testing, and drainage installation.",
    notes:
      "Client requested premium brass fittings for the master bathroom. Work scheduled to minimize household disruption.",
    attachments: [],
    hasCompletedSummary: true,
    status: "Draft",
    paymentMethod: "Cash",
    isItemsSelected: true,
    items: items_102,
    sections: sections_102,
  },
  {
    id: "QT-2025-103",
    title: "Retail Store Interior Fit-Out",
    referenceNumber: "QT-2025-103",
    quoteDate: "2025-09-02",
    expiryDate: "2025-10-02",
    hidePhoneNumber: false,
    clientId: "client-3",
    jobDescription:
      "Interior fit-out for a new retail store including ceramic wall tiling, ambient lighting, glass partitions, and display area grouting.",
    notes:
      "Client requires handover before the autumn launch date. Out-of-hours installation agreed.",
    attachments: [],
    hasCompletedSummary: true,
    status: "Sent",
    paymentMethod: "Online",
    isItemsSelected: true,
    items: items_103,
    sections: sections_103,
  },
  {
    id: "QT-2025-104",
    title: "Electrical Wiring & Lighting",
    referenceNumber: "QT-2025-104",
    quoteDate: "2025-09-18",
    expiryDate: "2025-10-18",
    hidePhoneNumber: false,
    clientId: "client-4",
    jobDescription:
      "Full electrical rewiring and LED lighting installation for commercial premises, including surge-protected power distribution.",
    notes:
      "All high-load circuit breakers to be replaced with modern RCBO units. Night-shift work scheduled.",
    attachments: [],
    hasCompletedSummary: true,
    status: "Draft",
    paymentMethod: "Cash",
    isItemsSelected: true,
    items: items_104,
    sections: sections_104,
  },
  {
    id: "QT-2025-105",
    title: "Painting & Finishing Services",
    referenceNumber: "QT-2025-105",
    quoteDate: "2025-09-18",
    expiryDate: "2025-10-18",
    hidePhoneNumber: false,
    clientId: "client-5",
    jobDescription:
      "Complete internal painting, hardwood floor machine polishing, and designer wallpaper installation across all living areas.",
    notes:
      "Low-VOC eco-friendly paint requested by homeowner. Sample swatches already approved.",
    attachments: [],
    hasCompletedSummary: true,
    status: "Draft",
    paymentMethod: "Online",
    isItemsSelected: true,
    items: items_105,
    sections: sections_105,
  },
];

export const quotesSlice = createSlice({
  initialState: quotesInitialState,
  name: "quotes",
  reducers: {
    addQuote: (
      state,
      action: PayloadAction<Partial<Omit<Quote, "id">> & { id: string }>,
    ) => {
      console.log("adding");
      Object.assign(state, [...state, action.payload]);
    },

    updateQuote: (
      state,
      action: PayloadAction<Partial<Omit<Quote, "id">> & { id: string }>,
    ) => {
      const { id, ...patch } = action.payload;
      const idx = state.findIndex((q) => q.id === id);
      console.log(idx);
      if (idx !== -1) {
        Object.assign(state[idx], patch);
      } else {
        state.push({ ...(patch as Quote), id: id });
      }
    },

    /** Update a single line item inside a quote, recomputing its total */
    updateQuoteLineItem: (
      state,
      action: PayloadAction<{
        quoteId: string;
        itemId: string;
        patch: Partial<Omit<QuoteLineItem, "id" | "total">>;
      }>,
    ) => {
      const { quoteId, itemId, patch } = action.payload;
      const quote = state.find((q) => q.id === quoteId);
      if (!quote) return;
      const item = quote.items.find((i) => i.id === itemId);
      if (!item) return;
      Object.assign(item, patch);
      // Re-derive total whenever pricePerUnit or quantity changes
      item.total = item.pricePerUnit * item.quantity;
    },

    /** Update all sections for a quote */
    updateQuoteSections: (
      state,
      action: PayloadAction<{
        quoteId: string;
        sections: QuoteSection[];
      }>,
    ) => {
      const quote = state.find((q) => q.id === action.payload.quoteId);
      if (quote) {
        quote.sections = action.payload.sections;
      }
    },

    /** Add a section to a quote */
    addQuoteSection: (
      state,
      action: PayloadAction<{
        quoteId: string;
        section: QuoteSection;
      }>,
    ) => {
      const quote = state.find((q) => q.id === action.payload.quoteId);
      if (quote) {
        if (!quote.sections) quote.sections = [];
        quote.sections.push(action.payload.section);
      }
    },

    /** Remove a section from a quote by order */
    removeQuoteSection: (
      state,
      action: PayloadAction<{
        quoteId: string;
        order: string;
      }>,
    ) => {
      const quote = state.find((q) => q.id === action.payload.quoteId);
      if (quote && quote.sections) {
        quote.sections = quote.sections.filter(
          (s) => s.order !== action.payload.order,
        );
      }
    },

    removeQuote: (state, action: PayloadAction<{ id: string }>) => {
      const idx = state.findIndex((q) => q.id === action.payload.id);
      if (idx !== -1) {
        state.splice(idx, 1);
      }
    },
  },
});

export const {
  addQuote,
  updateQuote,
  updateQuoteLineItem,
  updateQuoteSections,
  addQuoteSection,
  removeQuoteSection,
  removeQuote,
} = quotesSlice.actions;

export default quotesSlice.reducer;
