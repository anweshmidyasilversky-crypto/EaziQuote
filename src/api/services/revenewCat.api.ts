import type {
  OfferingProductDetails,
  RevenueCatResponse,
} from "@/types/api.responses.type";
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

export const getProductDetails = async ({
  userId,
  productId,
}: {
  userId: number;
  productId: string | number;
}) => {
  try {
    const res = await revenewCatInstance.get<{
      product_details: OfferingProductDetails[];
    }>(API_ENDPOINTS.revenewCat.productDetails(userId), {
      params: {
        id: productId,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
