export interface UserType {
  name: string;
  phoneNumber: string;
  email: string;
  businessName: string;
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
