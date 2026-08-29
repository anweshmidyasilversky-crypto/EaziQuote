import type { ClientCreationPayload } from "./clientCreation.payload.type";

export interface Client extends ClientCreationPayload {
  id: string;
}
