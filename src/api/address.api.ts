import {
  type ApiResponse,
  type AddressDetails,
} from "@/types/api.responses.type";
import { axiosInstance } from "./axiosInstance";

export const getAddressList = async (postCode: string) => {
  try {
    const addressList = await axiosInstance.get<ApiResponse<AddressDetails[]>>(
      `/address/search`,
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
