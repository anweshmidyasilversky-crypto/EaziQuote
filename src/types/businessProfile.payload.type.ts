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
