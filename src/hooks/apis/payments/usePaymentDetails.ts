import { showErrorToast } from "@/api/axiosInstance";
import { paymentDetails } from "@/api/services/payments.api";
import { useQuery } from "@tanstack/react-query";

export type usePaymentDetailsProps = {
  id: string | number;
};

function usePaymentDetails({ id }: usePaymentDetailsProps) {
  const { data, isFetching, error } = useQuery({
    queryKey: ["payment_details"],
    queryFn: () => paymentDetails(id),
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    paymentDetails: data?.payload,
    isFetching,
  };
}

export default usePaymentDetails;
