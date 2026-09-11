import type {
  ApiResponse,
  Client,
  ClientDetails,
  ListResponse,
} from "@/types/api.responses.type";
import { axiosInstance } from "./axiosInstance";
import type {
  ClientCreateApiPayload,
  PageFilters,
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

export const updateClient = async (
  client_id: string,
  patch: UpdateClientApiPayload,
) => {
  try {
    const updatedClient = await axiosInstance.post<ApiResponse<Client>>(
      `/clients/${client_id}`,
      ObjToFormData(patch),
    );
    return updatedClient.data;
  } catch (err) {
    throw err;
  }
};

export const getClientList = async (filters?: PageFilters) => {
  try {
    const clientList = await axiosInstance.get<
      ApiResponse<ListResponse<ClientDetails>>
    >(`/clients`, {
      params: { ...filters },
    });
    return clientList.data;
  } catch (err) {
    throw err;
  }
};

export const getClientShortInfo = async (client_id: string) => {
  try {
    const client = await axiosInstance.get<ApiResponse<Client>>(
      `/client/client-details`,
      {
        params: {
          id: client_id,
        },
      },
    );
    return client.data;
  } catch (err) {
    throw err;
  }
};

export const getClientDetails = async (client_id: string) => {
  try {
    const clientDetails = await axiosInstance.get<ApiResponse<ClientDetails>>(
      `/clients/${client_id}`,
    );
    return clientDetails.data;
  } catch (err) {
    throw err;
  }
};

export const deleteClient = async (client_id: string) => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/clients/${client_id}`,
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};
