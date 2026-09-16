import {
  type ApiResponse,
  type AddressDetails,
} from "@/types/api.responses.type";
import { axiosInstance } from "../axiosInstance";
import { API_ENDPOINTS } from "@/constants/endPoints";

export const getAddressList = async (postCode: string) => {
  try {
    const addressList = await axiosInstance.get<ApiResponse<AddressDetails[]>>(
      API_ENDPOINTS.address.addressSearch,
      {
        params: {
          postcode: postCode,
        },
      },
    );
    return addressList.data;
  } catch (err) {
    throw err;
  }
};
