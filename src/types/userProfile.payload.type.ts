import { type Method } from "axios";

export interface UserProfilePayload {
  profilePic?: File;
  name: string;
  phoneNo: string;
}

export interface ProfileCreateApiPayload {
  avatar: File | null;
  name: string;
  phone: string;
  _method: Method;
}
