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
    status: "Draft",
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
