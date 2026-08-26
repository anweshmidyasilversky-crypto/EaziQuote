export type AddressDetail = {
  street: string;
  city: string;
  postCode: string;
  country: string;
};

export interface NotificationItem {
  id: number;
  notification: string;
  timestamp: string; // ISO 8601 string format
}

export interface TransactionItem {
  id: string; // Crucial for React map rendering keys
  title: string;
  quoteInvoice: string;
  client: string;
  amount: string;
  status: "Sent" | "Paid" | "Overdue" | "Draft";
  creationDate: string;
  expiryDueDate: string;
}

export type ClientItem = {
  client: string;
  company: string;
  phone: string;
  email: string;
};

export interface ClientDataWithFilters extends ClientItem {
  id: string;
  createdAt: string; // Required for "Recently Added" filter
  activityCount: number; // Required for "Most Active" filter
}

export enum ClientActivityStatus {
  Paid = "Paid",
  Overdue = "Overdue",
  Sent = "Sent",
  Rejected = "Rejected",
  Due = "Due",
  Draft = "Draft",
  Approved = "Approved",
  Completed = "Completed",
  Cancelled = "Cancelled",
  Received = "Received",
}

export enum PaymentActivityStatus {
  Pending = "Pending",
  Received = "Received",
  Failed = "Failed",
  Cancelled = "Cancelled",
  Refunded = "Refunded",
}

export interface ClientActivity {
  id: string;
  title: string;
  quoteInvoice: string;
  amount: number;
  status: ClientActivityStatus;
  creationDate: string;
  expiryDueDate: string;
}

export type PaymentData = {
  id: string;
  quoteInvoice: "Invoice" | "Deposit";
  amount: number;
  status: PaymentActivityStatus;
  creationDate: string;
  expiryDueDate: string | null;
  allocated: number;
  credit: number;
  method: "Cash" | "Stripe";
};

export enum QuoteActivityStatus {
  Draft = "Draft",
  Sent = "Sent",
  Accepted = "Accepted",
  Rejected = "Rejected",
  Expired = "Expired",
  Cancelled = "Cancelled",
}

export type QuoteData = {
  id: string;
  title: string;
  quote: string;
  client: string;
  amount: number;
  status: QuoteActivityStatus;
  creationDate: string;
  expiryDate: string;
  paymentMethod: "Cash" | "Online";
  companyName?: string;
  invoices?: Invoice[];
};

export type ItemData = {
  itemName: string;
  category: "Materials" | "Services";
  subcategory: string;
  quantity: string;
  pricePerUnit: number;
  unitCost: number;
  total: number;
};

export type InvoiceStatus =
  | "Paid"
  | "Pending"
  | "Overdue"
  | "Draft"
  | "Cancelled";

export interface Invoice {
  id: string;
  itemName: string;
  category: string;
  subcategory: string;
  quantity: string;
  pricePerUnit: number;
  unitCost: number;
  total: number;
  status: InvoiceStatus;
}

export const invoiceData: Invoice[] = [
  {
    id: "INV-2025-101",
    itemName: "Floor Tiles",
    category: "Materials",
    subcategory: "Tools",
    quantity: "250 sq.ft",
    pricePerUnit: 12,
    unitCost: 6,
    total: 3000,
    status: "Paid",
  },
  {
    id: "INV-2025-102",
    itemName: "Glass Partition",
    category: "Materials",
    subcategory: "Ceiling",
    quantity: "4 panels",
    pricePerUnit: 150,
    unitCost: 75,
    total: 600,
    status: "Pending",
  },
  {
    id: "INV-2025-103",
    itemName: "Painting",
    category: "Services",
    subcategory: "Painting",
    quantity: "20 hours",
    pricePerUnit: 60,
    unitCost: 30,
    total: 900,
    status: "Overdue",
  },
  {
    id: "INV-2025-104",
    itemName: "Carpet Replacement",
    category: "Services",
    subcategory: "Carpeting",
    quantity: "250 sq.ft",
    pricePerUnit: 12,
    unitCost: 6,
    total: 3000,
    status: "Draft",
  },
  {
    id: "INV-2025-105",
    itemName: "Floor Renovation",
    category: "Services",
    subcategory: "Flooring",
    quantity: "20 hours",
    pricePerUnit: 60,
    unitCost: 30,
    total: 900,
    status: "Paid",
  },
  {
    id: "INV-2025-106",
    itemName: "Wooden Doors",
    category: "Materials",
    subcategory: "Doors",
    quantity: "8 units",
    pricePerUnit: 280,
    unitCost: 180,
    total: 2240,
    status: "Pending",
  },
  {
    id: "INV-2025-107",
    itemName: "LED Lighting",
    category: "Materials",
    subcategory: "Electrical",
    quantity: "24 units",
    pricePerUnit: 45,
    unitCost: 25,
    total: 1080,
    status: "Paid",
  },
  {
    id: "INV-2025-108",
    itemName: "Plumbing Installation",
    category: "Services",
    subcategory: "Plumbing",
    quantity: "16 hours",
    pricePerUnit: 75,
    unitCost: 40,
    total: 1200,
    status: "Overdue",
  },
  {
    id: "INV-2025-109",
    itemName: "Wall Panels",
    category: "Materials",
    subcategory: "Wall Finishing",
    quantity: "120 sq.ft",
    pricePerUnit: 35,
    unitCost: 20,
    total: 4200,
    status: "Pending",
  },
  {
    id: "INV-2025-110",
    itemName: "Electrical Wiring",
    category: "Services",
    subcategory: "Electrical",
    quantity: "180 metres",
    pricePerUnit: 18,
    unitCost: 10,
    total: 3240,
    status: "Draft",
  },
];

export const itemData: ItemData[] = [
  {
    itemName: "Floor Tiles",
    category: "Materials",
    subcategory: "Tools",
    quantity: "250 sq.ft",
    pricePerUnit: 12,
    unitCost: 6,
    total: 3000,
  },
  {
    itemName: "Glass Partition",
    category: "Materials",
    subcategory: "Ceiling",
    quantity: "4 panels",
    pricePerUnit: 150,
    unitCost: 75,
    total: 600,
  },
  {
    itemName: "Painting",
    category: "Services",
    subcategory: "Painting",
    quantity: "20 hours",
    pricePerUnit: 60,
    unitCost: 30,
    total: 900,
  },
  {
    itemName: "Carpet Replacement",
    category: "Services",
    subcategory: "Carpeting",
    quantity: "250 sq.ft",
    pricePerUnit: 12,
    unitCost: 6,
    total: 3000,
  },
  {
    itemName: "Floor Renovation",
    category: "Services",
    subcategory: "Flooring",
    quantity: "20 hours",
    pricePerUnit: 60,
    unitCost: 30,
    total: 900,
  },
  {
    itemName: "Wooden Doors",
    category: "Materials",
    subcategory: "Doors",
    quantity: "8 units",
    pricePerUnit: 280,
    unitCost: 180,
    total: 2240,
  },
  {
    itemName: "LED Lighting",
    category: "Materials",
    subcategory: "Electrical",
    quantity: "24 units",
    pricePerUnit: 45,
    unitCost: 25,
    total: 1080,
  },
  {
    itemName: "Plumbing Installation",
    category: "Services",
    subcategory: "Plumbing",
    quantity: "16 hours",
    pricePerUnit: 75,
    unitCost: 40,
    total: 1200,
  },
  {
    itemName: "Wall Panels",
    category: "Materials",
    subcategory: "Wall Finishing",
    quantity: "120 sq.ft",
    pricePerUnit: 35,
    unitCost: 20,
    total: 4200,
  },
  {
    itemName: "Electrical Wiring",
    category: "Services",
    subcategory: "Electrical",
    quantity: "180 metres",
    pricePerUnit: 18,
    unitCost: 10,
    total: 3240,
  },
  {
    itemName: "Marble Flooring",
    category: "Materials",
    subcategory: "Flooring",
    quantity: "180 sq.ft",
    pricePerUnit: 45,
    unitCost: 28,
    total: 8100,
  },
  {
    itemName: "False Ceiling",
    category: "Materials",
    subcategory: "Ceiling",
    quantity: "320 sq.ft",
    pricePerUnit: 18,
    unitCost: 10,
    total: 5760,
  },
  {
    itemName: "Aluminum Windows",
    category: "Materials",
    subcategory: "Windows",
    quantity: "12 units",
    pricePerUnit: 220,
    unitCost: 140,
    total: 2640,
  },
  {
    itemName: "Wooden Flooring",
    category: "Materials",
    subcategory: "Flooring",
    quantity: "200 sq.ft",
    pricePerUnit: 32,
    unitCost: 20,
    total: 6400,
  },
  {
    itemName: "Interior Doors",
    category: "Materials",
    subcategory: "Doors",
    quantity: "6 units",
    pricePerUnit: 350,
    unitCost: 220,
    total: 2100,
  },
  {
    itemName: "Ceramic Wall Tiles",
    category: "Materials",
    subcategory: "Wall Finishing",
    quantity: "300 sq.ft",
    pricePerUnit: 14,
    unitCost: 8,
    total: 4200,
  },
  {
    itemName: "Bathroom Fixtures",
    category: "Materials",
    subcategory: "Plumbing",
    quantity: "5 sets",
    pricePerUnit: 180,
    unitCost: 110,
    total: 900,
  },
  {
    itemName: "Copper Pipes",
    category: "Materials",
    subcategory: "Plumbing",
    quantity: "120 metres",
    pricePerUnit: 22,
    unitCost: 14,
    total: 2640,
  },
  {
    itemName: "Power Sockets",
    category: "Materials",
    subcategory: "Electrical",
    quantity: "30 units",
    pricePerUnit: 18,
    unitCost: 10,
    total: 540,
  },
  {
    itemName: "Ceiling Fans",
    category: "Materials",
    subcategory: "Electrical",
    quantity: "10 units",
    pricePerUnit: 95,
    unitCost: 60,
    total: 950,
  },
  {
    itemName: "Wall Painting",
    category: "Services",
    subcategory: "Painting",
    quantity: "35 hours",
    pricePerUnit: 55,
    unitCost: 28,
    total: 1925,
  },
  {
    itemName: "Floor Polishing",
    category: "Services",
    subcategory: "Flooring",
    quantity: "240 sq.ft",
    pricePerUnit: 15,
    unitCost: 8,
    total: 3600,
  },
  {
    itemName: "Carpentry Work",
    category: "Services",
    subcategory: "Carpentry",
    quantity: "28 hours",
    pricePerUnit: 70,
    unitCost: 40,
    total: 1960,
  },
  {
    itemName: "AC Installation",
    category: "Services",
    subcategory: "HVAC",
    quantity: "4 units",
    pricePerUnit: 180,
    unitCost: 100,
    total: 720,
  },
  {
    itemName: "Electrical Maintenance",
    category: "Services",
    subcategory: "Electrical",
    quantity: "24 hours",
    pricePerUnit: 65,
    unitCost: 35,
    total: 1560,
  },
  {
    itemName: "Plumbing Repair",
    category: "Services",
    subcategory: "Plumbing",
    quantity: "12 hours",
    pricePerUnit: 80,
    unitCost: 45,
    total: 960,
  },
  {
    itemName: "Wallpaper Installation",
    category: "Services",
    subcategory: "Wall Finishing",
    quantity: "280 sq.ft",
    pricePerUnit: 16,
    unitCost: 9,
    total: 4480,
  },
  {
    itemName: "Office Partition",
    category: "Materials",
    subcategory: "Partitions",
    quantity: "6 panels",
    pricePerUnit: 175,
    unitCost: 100,
    total: 1050,
  },
  {
    itemName: "Granite Countertop",
    category: "Materials",
    subcategory: "Countertops",
    quantity: "45 sq.ft",
    pricePerUnit: 55,
    unitCost: 35,
    total: 2475,
  },
  {
    itemName: "Kitchen Cabinets",
    category: "Materials",
    subcategory: "Cabinetry",
    quantity: "10 units",
    pricePerUnit: 320,
    unitCost: 210,
    total: 3200,
  },
  {
    itemName: "Glass Door",
    category: "Materials",
    subcategory: "Doors",
    quantity: "3 units",
    pricePerUnit: 420,
    unitCost: 280,
    total: 1260,
  },
  {
    itemName: "Drainage Installation",
    category: "Services",
    subcategory: "Plumbing",
    quantity: "18 hours",
    pricePerUnit: 72,
    unitCost: 38,
    total: 1296,
  },
  {
    itemName: "Lighting Installation",
    category: "Services",
    subcategory: "Electrical",
    quantity: "20 hours",
    pricePerUnit: 58,
    unitCost: 30,
    total: 1160,
  },
  {
    itemName: "Tile Grouting",
    category: "Services",
    subcategory: "Flooring",
    quantity: "260 sq.ft",
    pricePerUnit: 10,
    unitCost: 5,
    total: 2600,
  },
  {
    itemName: "Wood Paneling",
    category: "Materials",
    subcategory: "Wall Finishing",
    quantity: "150 sq.ft",
    pricePerUnit: 38,
    unitCost: 24,
    total: 5700,
  },
  {
    itemName: "Insulation Work",
    category: "Services",
    subcategory: "HVAC",
    quantity: "300 sq.ft",
    pricePerUnit: 14,
    unitCost: 8,
    total: 4200,
  },
  {
    itemName: "Reception Counter",
    category: "Materials",
    subcategory: "Furniture",
    quantity: "1 unit",
    pricePerUnit: 850,
    unitCost: 550,
    total: 850,
  },
  {
    itemName: "Office Chairs",
    category: "Materials",
    subcategory: "Furniture",
    quantity: "18 units",
    pricePerUnit: 145,
    unitCost: 90,
    total: 2610,
  },
];

export const quoteData: QuoteData[] = [
  {
    id: "QT-2025-101",
    title: "Office Interior Design",
    quote: "QT-2025-101",
    client: "Emma Robinson",
    amount: 4850,
    status: QuoteActivityStatus.Sent,
    creationDate: "12 Sep 2025",
    expiryDate: "12 Sep 2025",
    paymentMethod: "Cash",
  },
  {
    id: "QT-2025-102",
    title: "Residential Plumbing Works",
    quote: "QT-2025-102",
    client: "Daniel Murphy",
    amount: 6200,
    status: QuoteActivityStatus.Draft,
    creationDate: "15 Sep 2025",
    expiryDate: "12 Sep 2025",
    paymentMethod: "Cash",
  },
  {
    id: "QT-2025-103",
    title: "Retail Store Interior Fit-Out",
    quote: "QT-2025-103",
    client: "Olivia Bennett",
    amount: 3450,
    status: QuoteActivityStatus.Sent,
    creationDate: "02 Sep 2025",
    expiryDate: "12 Sep 2025",
    paymentMethod: "Cash",
  },
  {
    id: "QT-2025-104",
    title: "Electrical Wiring & Lighting",
    quote: "QT-2025-104",
    client: "James Carter",
    amount: 5175,
    status: QuoteActivityStatus.Draft,
    creationDate: "18 Sep 2025",
    expiryDate: "12 Sep 2025",
    paymentMethod: "Cash",
  },
  {
    id: "QT-2025-105",
    title: "Painting & Finishing Services",
    quote: "QT-2025-105",
    client: "Sophia Turner",
    amount: 2900,
    status: QuoteActivityStatus.Draft,
    creationDate: "18 Sep 2025",
    expiryDate: "12 Sep 2025",
    paymentMethod: "Cash",
  },
  {
    id: "QT-2025-101-2",
    title: "Office Interior Design",
    quote: "QT-2025-101",
    client: "Emma Robinson",
    amount: 4850,
    status: QuoteActivityStatus.Sent,
    creationDate: "12 Sep 2025",
    expiryDate: "12 Sep 2025",
    paymentMethod: "Cash",
  },
  {
    id: "QT-2025-102-2",
    title: "Residential Plumbing Works",
    quote: "QT-2025-102",
    client: "Daniel Murphy",
    amount: 6200,
    status: QuoteActivityStatus.Draft,
    creationDate: "15 Sep 2025",
    expiryDate: "12 Sep 2025",
    paymentMethod: "Cash",
  },
  {
    id: "QT-2025-103-2",
    title: "Retail Store Interior Fit-Out",
    quote: "QT-2025-103",
    client: "Olivia Bennett",
    amount: 3450,
    status: QuoteActivityStatus.Sent,
    creationDate: "02 Sep 2025",
    expiryDate: "12 Sep 2025",
    paymentMethod: "Cash",
  },
  {
    id: "QT-2025-104-2",
    title: "Electrical Wiring & Lighting",
    quote: "QT-2025-104",
    client: "James Carter",
    amount: 5175,
    status: QuoteActivityStatus.Draft,
    creationDate: "18 Sep 2025",
    expiryDate: "12 Sep 2025",
    paymentMethod: "Cash",
  },
  {
    id: "QT-2025-105-2",
    title: "Painting & Finishing Services",
    quote: "QT-2025-105",
    client: "Sophia Turner",
    amount: 2900,
    status: QuoteActivityStatus.Draft,
    creationDate: "18 Sep 2025",
    expiryDate: "12 Sep 2025",
    paymentMethod: "Cash",
  },
];

export const paymentData: PaymentData[] = [
  {
    id: "PMT5",
    quoteInvoice: "Invoice",
    amount: 5000,
    status: PaymentActivityStatus.Received,
    creationDate: "25 Mar 2026",
    expiryDueDate: null,
    allocated: 3000,
    credit: 2000,
    method: "Cash",
  },
  {
    id: "PMT4",
    quoteInvoice: "Invoice",
    amount: 2000,
    status: PaymentActivityStatus.Pending,
    creationDate: "20 May 2026",
    expiryDueDate: null,
    allocated: 1000,
    credit: 1000,
    method: "Stripe",
  },
  {
    id: "PMT3",
    quoteInvoice: "Deposit",
    amount: 2000,
    status: PaymentActivityStatus.Pending,
    creationDate: "2 May 2026",
    expiryDueDate: null,
    allocated: 1500,
    credit: 500,
    method: "Stripe",
  },
  {
    id: "PMT2",
    quoteInvoice: "Invoice",
    amount: 1000,
    status: PaymentActivityStatus.Received,
    creationDate: "25 Apr 2026",
    expiryDueDate: null,
    allocated: 1000,
    credit: 0,
    method: "Cash",
  },
  {
    id: "PMT1",
    quoteInvoice: "Deposit",
    amount: 3000,
    status: PaymentActivityStatus.Pending,
    creationDate: "20 Apr 2026",
    expiryDueDate: null,
    allocated: 0,
    credit: 3000,
    method: "Stripe",
  },
];

export const mockClientActivity: ClientActivity[] = [
  {
    id: "1",
    title: "Office Interior Design",
    quoteInvoice: "QT-2025-101",
    amount: 48500,
    status: ClientActivityStatus.Sent,
    creationDate: "12 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
  {
    id: "2",
    title: "Residential Plumbing Works",
    quoteInvoice: "QT-2025-102",
    amount: 4850,
    status: ClientActivityStatus.Draft,
    creationDate: "12 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
  {
    id: "3",
    title: "Retail Store Interior Fit-Out",
    quoteInvoice: "INV-2025-103",
    amount: 4850,
    status: ClientActivityStatus.Overdue,
    creationDate: "12 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
  {
    id: "4",
    title: "Electrical Wiring & Lighting",
    quoteInvoice: "INV-2025-104",
    amount: 4850,
    status: ClientActivityStatus.Paid,
    creationDate: "12 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
  {
    id: "5",
    title: "Painting & Finishing Services",
    quoteInvoice: "QT-2025-105",
    amount: 4850,
    status: ClientActivityStatus.Draft,
    creationDate: "12 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
  {
    id: "6",
    title: "Office Interior Design",
    quoteInvoice: "QT-2025-101",
    amount: 4850,
    status: ClientActivityStatus.Sent,
    creationDate: "12 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
  {
    id: "7",
    title: "Residential Plumbing Works",
    quoteInvoice: "QT-2025-102",
    amount: 4850,
    status: ClientActivityStatus.Draft,
    creationDate: "12 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
];

export const mockClientData: ClientDataWithFilters[] = [
  {
    id: "1",
    client: "Emma Smith",
    company: "Smith & Co Builders",
    phone: "(+44) 456-789-2002",
    email: "es@gmail.com",
    createdAt: "2026-08-15T10:30:00Z",
    activityCount: 24,
  },
  {
    id: "2",
    client: "Daniel Murphy",
    company: "Murphy Industries",
    phone: "(+44) 456-789-2002",
    email: "dm@gmail.com",
    createdAt: "2026-08-14T14:20:00Z",
    activityCount: 42,
  },
  {
    id: "3",
    client: "Olivia Bennett",
    company: "Bennett Pvt. Ltd.",
    phone: "(+44) 456-789-2002",
    email: "ob@gmail.com",
    createdAt: "2026-08-12T09:15:00Z",
    activityCount: 12,
  },
  {
    id: "4",
    client: "James Carter",
    company: "Carter Groups",
    phone: "(+44) 456-789-2002",
    email: "jc@gmail.com",
    createdAt: "2026-08-10T11:45:00Z",
    activityCount: 18,
  },
  {
    id: "5",
    client: "Sophia Turner",
    company: "Turner & Turner",
    phone: "(+44) 456-789-2002",
    email: "st@gmail.com",
    createdAt: "2026-08-08T16:00:00Z",
    activityCount: 35,
  },
  {
    id: "6",
    client: "Emma Smith",
    company: "Smith & Co Builders",
    phone: "(+44) 456-789-2002",
    email: "es@gmail.com",
    createdAt: "2026-08-05T08:00:00Z",
    activityCount: 24,
  },
  {
    id: "7",
    client: "Daniel Murphy",
    company: "Murphy Industries",
    phone: "(+44) 456-789-2002",
    email: "dm@gmail.com",
    createdAt: "2026-08-03T12:10:00Z",
    activityCount: 42,
  },
  {
    id: "8",
    client: "Olivia Bennett",
    company: "Bennett Pvt. Ltd.",
    phone: "(+44) 456-789-2002",
    email: "ob@gmail.com",
    createdAt: "2026-08-02T15:30:00Z",
    activityCount: 12,
  },
  {
    id: "9",
    client: "James Carter",
    company: "Carter Groups",
    phone: "(+44) 456-789-2002",
    email: "jc@gmail.com",
    createdAt: "2026-07-28T17:25:00Z",
    activityCount: 18,
  },
  {
    id: "10",
    client: "Sophia Turner",
    company: "Turner & Turner",
    phone: "(+44) 456-789-2002",
    email: "st@gmail.com",
    createdAt: "2026-07-25T13:40:00Z",
    activityCount: 35,
  },
];

export const addressList: AddressDetail[] = [
  {
    street: "Ambawadi Road",
    city: "Ahmedabad",
    postCode: "380015",
    country: "India",
  },
  {
    street: "Connaught Place",
    city: "New Delhi",
    postCode: "110001",
    country: "India",
  },
  {
    street: "Colaba Causeway",
    city: "Mumbai",
    postCode: "400001",
    country: "India",
  },
  {
    street: "Park Street",
    city: "Kolkata",
    postCode: "700001",
    country: "India",
  },
  {
    street: "Anna Salai",
    city: "Chennai",
    postCode: "600001",
    country: "India",
  },
  {
    street: "Mahatma Gandhi Road",
    city: "Bengaluru",
    postCode: "560001",
    country: "India",
  },
  {
    street: "Abids Road",
    city: "Hyderabad",
    postCode: "500001",
    country: "India",
  },
  {
    street: "Salt Lake Sector 5",
    city: "Kolkata",
    postCode: "700091",
    country: "India",
  },
  {
    street: "Sector 62",
    city: "Noida",
    postCode: "201301",
    country: "India",
  },
  {
    street: "IFFCO Chowk",
    city: "Gurugram",
    postCode: "122001",
    country: "India",
  },
  {
    street: "Ghod Dod Road",
    city: "Surat",
    postCode: "395003",
    country: "India",
  },
  {
    street: "Fergusson College Road",
    city: "Pune",
    postCode: "411001",
    country: "India",
  },
];

export const postalCodes: string[] = [
  "380015",
  "110001",
  "400001",
  "700001",
  "600001",
  "560001",
  "500001",
  "700091",
  "201301",
  "122001",
  "395003",
  "411001",
] as const;

export const notifications: NotificationItem[] = [
  {
    id: 1,
    notification: "Mike Wilson has accepted Quote #QT-2025-108.",
    timestamp: "2026-08-19T10:01:00Z", // 5 hours ago
  },
  {
    id: 2,
    notification:
      "Payment received for Invoice #INV-2025-045, $1,250 credited to your account.",
    timestamp: "2026-08-18T23:01:00Z", // 16 hours ago
  },
  {
    id: 3,
    notification: "Quote #QT-2025-102 for Emma Davis has expired.",
    timestamp: "2026-08-17T15:01:00Z", // 2 days ago
  },
  {
    id: 4,
    notification: "Invoice #INV-2025-033 for John Carter is overdue by 3 days.",
    timestamp: "2026-08-16T15:01:00Z", // 3 days ago
  },
];

export const transactionItems: TransactionItem[] = [
  {
    id: "quote-102-v1",
    title: "Residential Plumbing Works",
    quoteInvoice: "QT-2025-102",
    client: "Daniel Murphy",
    amount: "£6,200.00",
    status: "Draft",
    creationDate: "15 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
  {
    id: "quote-103-v1",
    title: "Retail Store Interior Fit-Out",
    quoteInvoice: "QT-2025-103",
    client: "Olivia Bennett",
    amount: "£3,450.00",
    status: "Sent",
    creationDate: "02 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
  {
    id: "quote-104-v1",
    title: "Electrical Wiring & Lighting",
    quoteInvoice: "QT-2025-104",
    client: "James Carter",
    amount: "£5,175.00",
    status: "Draft",
    creationDate: "18 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
  {
    id: "quote-105-v1",
    title: "Painting & Finishing Services",
    quoteInvoice: "QT-2025-105",
    client: "Sophia Turner",
    amount: "£2,900.00",
    status: "Paid",
    creationDate: "18 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
  {
    id: "quote-101-v2",
    title: "Office Interior Design",
    quoteInvoice: "QT-2025-101",
    client: "Emma Robinson",
    amount: "£4,850.00",
    status: "Sent",
    creationDate: "12 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
  {
    id: "quote-102-v2",
    title: "Residential Plumbing Works",
    quoteInvoice: "QT-2025-102",
    client: "Daniel Murphy",
    amount: "£6,200.00",
    status: "Draft",
    creationDate: "15 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
  {
    id: "quote-103-v2",
    title: "Retail Store Interior Fit-Out",
    quoteInvoice: "QT-2025-103",
    client: "Olivia Bennett",
    amount: "£3,450.00",
    status: "Sent",
    creationDate: "02 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
  {
    id: "quote-104-v2",
    title: "Electrical Wiring & Lighting",
    quoteInvoice: "QT-2025-104",
    client: "James Carter",
    amount: "£5,175.00",
    status: "Draft",
    creationDate: "18 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
  {
    id: "quote-105-v2",
    title: "Painting & Finishing Services",
    quoteInvoice: "QT-2025-105",
    client: "Sophia Turner",
    amount: "£2,900.00",
    status: "Draft",
    creationDate: "18 Sep 2025",
    expiryDueDate: "12 Sep 2025",
  },
];
