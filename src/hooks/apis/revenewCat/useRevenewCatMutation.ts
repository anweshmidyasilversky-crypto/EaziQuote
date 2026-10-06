import { getProductDetails } from "@/api/services/revenewCat.api";
import { useMutation } from "@tanstack/react-query";

function useRevenewCatMutation() {
  const getProductDetailsMutation = useMutation({
    mutationFn: ({
      userId,
      productId,
    }: {
      userId: number;
      productId: string | number;
    }) => {
      return getProductDetails({ userId, productId });
    },
  });
  return {
    getProductDetailsMutation,
  };
}

export default useRevenewCatMutation;
