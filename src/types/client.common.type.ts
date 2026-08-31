export interface ClientCommonType {
  name: string;
  companyName: string;
  phone: string;
  email: string;
  /** ISO date string — when this client was created; used for "Recently Added" filter */
  createdAt?: string;
}
