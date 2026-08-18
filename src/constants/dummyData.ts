export type AddressDetail = {
  street: string;
  city: string;
  postCode: string;
  country: string;
};

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
