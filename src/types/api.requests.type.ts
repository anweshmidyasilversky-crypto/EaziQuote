export enum deviceType {
  android = "android",
  ios = "ios",
  web = "web",
}

export interface SignupPayload {
  email: string;
  password: string;
  device_type: deviceType;
}
