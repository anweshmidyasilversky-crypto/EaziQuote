export interface UserType {
  name: string;
  profileImgUrl: string | undefined;
  phoneNumber: string;
  email: string;
  businessName: string;
  businessLogoUrl: string | undefined;
  businessPhoneNo: string;
  trade: string;
  vatRegistered: boolean;
  street: string;
  city: string;
  postCode: string;
  country: string;
  isUserProfileCreated: boolean;
  isBusinessProfileCreated: boolean;
  isBusinessAddressProvided: boolean;
  vatNumber?: string;
}
