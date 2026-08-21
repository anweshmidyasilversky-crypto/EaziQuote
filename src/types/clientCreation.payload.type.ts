import type { BusinessAddressPayload } from "./businessAddress.payload.type";

export interface ClientCreationPayload extends BusinessAddressPayload {
  name: string;
  companyName: string;
  phone: string;
  email: string;
}
