export interface UserType {
  name: string;
  phoneNumber: string;
  email: string;
  businessName: string;
  businessPhoneNo: string;
  trade: string;
  vatRegistered: boolean;
  formFilledUpto: number;
  street: string;
  city: string;
  postCode: string;
  country: string;
  vatNumber?: string;
}
