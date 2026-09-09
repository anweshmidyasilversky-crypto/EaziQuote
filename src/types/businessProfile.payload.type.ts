export interface BusinessProfilePayload {
  brandLogo?: File;
  brandColor: string;
  businessName: string;
  showBusinessName?: boolean;
  businessPhoneNo: string;
  trade: string;
  vatRegistered: boolean;
  vatNumber?: string;
}

export interface BuisnessProfileApiPayload {
  name: string;
  phone: string;
  brand_color: string;
  vat_number?: string;
}
