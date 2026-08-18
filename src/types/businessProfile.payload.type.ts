export interface BusinessProfilePayload {
  brandLogo: File;
  brandColor: string;
  businessName: string;
  businessPhoneNo: string;
  trade: string;
  vatRegistered: boolean;
  vatNumber?: string;
}
