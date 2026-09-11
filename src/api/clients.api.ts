import type { ApiResponse, Client } from "@/types/api.responses.type";
import { axiosInstance } from "./axiosInstance";
import type {
  ClientCreateApiPayload,
  UpdateClientApiPayload,
} from "@/types/api.requests.type";
import { ObjToFormData } from "@/lib/utils";

export const createClient = async (client: ClientCreateApiPayload) => {
  try {
    const newClient = await axiosInstance.post<ApiResponse<Client>>(
      `/clients`,
      ObjToFormData(client),
    );
    return newClient.data;
  } catch (err) {
    throw err;
  }
};

export const updateClient = async (patch: UpdateClientApiPayload) => {
  try {
    const updatedClient = await axiosInstance.post<ApiResponse<Client>>(
      `/clients`,
      ObjToFormData(patch),
    );
    return updatedClient.data;
  } catch (err) {
    throw err;
  }
};
