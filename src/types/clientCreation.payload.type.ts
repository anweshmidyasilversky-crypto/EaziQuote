import type { BusinessAddressPayload } from "./businessAddress.payload.type";
import type { ClientCommonType } from "./client.common.type";

export interface ClientCreationPayload
  extends BusinessAddressPayload, ClientCommonType {}
