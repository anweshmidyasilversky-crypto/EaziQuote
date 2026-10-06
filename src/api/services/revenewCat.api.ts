import { type RevenueCatResponse } from "@/types/api.responses.type";
import { revenewCatInstance } from "../revenewCatInstance";
import { API_ENDPOINTS } from "@/constants/endPoints";

export const getOfferings = async (userId: number) => {
  try {
    const offerListings = await revenewCatInstance.get<RevenueCatResponse>(
      API_ENDPOINTS.revenewCat.getOfferings(userId),
    );
    return offerListings.data;
  } catch (error) {
    throw error;
  }
};
